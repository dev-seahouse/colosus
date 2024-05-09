import {
  CentralDbPrismaService,
  Prisma,
  PrismaModel,
} from '@bambu/server-core/db/central-db';
import { ConnectAdvisorDto } from '@bambu/shared';
import { Injectable } from '@nestjs/common';
import { IPrismaRepositoryMapTypeDto, PrismaRepository } from '../base-classes';

class ConnectAdvisorMapType implements IPrismaRepositoryMapTypeDto {
  aggregate!: Prisma.ConnectAdvisorAggregateArgs;
  count!: Prisma.ConnectAdvisorCountArgs;
  create!: Prisma.ConnectAdvisorCreateArgs;
  delete!: Prisma.ConnectAdvisorDeleteArgs;
  deleteMany!: Prisma.ConnectAdvisorDeleteManyArgs;
  findFirst!: Prisma.ConnectAdvisorFindFirstArgs;
  findMany!: Prisma.ConnectAdvisorFindManyArgs;
  findUnique!: Prisma.ConnectAdvisorFindUniqueArgs;
  update!: Prisma.ConnectAdvisorUpdateArgs;
  updateMany!: Prisma.ConnectAdvisorUpdateManyArgs;
  upsert!: Prisma.ConnectAdvisorUpsertArgs;
}

export interface IFindAdvisorResponse extends PrismaModel.ConnectAdvisor {
  Tenant: PrismaModel.Tenant;
}

export type IUpsertAdvisorParams =
  Partial<ConnectAdvisorDto.IConnectAdvisorProfileInformationDto> &
    Pick<ConnectAdvisorDto.IConnectAdvisorProfileInformationDto, 'tenantRealm'>;

@Injectable()
export class ConnectAdvisorCentralDbRepositoryService extends PrismaRepository<
  Prisma.ConnectAdvisorDelegate<Prisma.RejectPerOperation>,
  ConnectAdvisorMapType
> {
  constructor(private readonly prisma: CentralDbPrismaService) {
    super(prisma.connectAdvisor);
  }

  public async FindAdvisor({
    tenantRealm,
    userId,
  }: {
    userId: string;
    tenantRealm: string;
  }): Promise<IFindAdvisorResponse | null> {
    const result = await this.prisma.connectAdvisor.findUnique({
      where: {
        Tenant: { realm: tenantRealm },
        userId,
      },
      include: {
        Tenant: {
          include: {
            tenantSubscriptions: {},
          },
        },
      },
    });
    if (!result || !result.Tenant) {
      return null;
    }

    return result;
  }

  public async FindFirstAdvisor({
    userId,
    tenantRealm,
  }: {
    userId?: string;
    tenantRealm: string;
  }): Promise<IFindAdvisorResponse | null> {
    const result = await this.prisma.connectAdvisor.findFirst({
      where: {
        Tenant: { realm: tenantRealm },
        userId,
      },
      include: {
        Tenant: {
          include: {
            tenantSubscriptions: {},
          },
        },
      },
    });
    if (!result || !result.Tenant) {
      return null;
    }

    return result;
  }

  public async UpsertAdvisor(
    advisor: Partial<ConnectAdvisorDto.IConnectAdvisorProfileInformationDto> &
      Pick<
        ConnectAdvisorDto.IConnectAdvisorProfileInformationDto,
        'userId' | 'tenantRealm'
      >
  ): Promise<PrismaModel.ConnectAdvisor | null> {
    // TODO
    const { userId, tenantRealm, ...data } = advisor;
    const timeStamp = new Date().toISOString();

    const updatePayload: Record<string, unknown> = {};

    /**
     * Need to create a stub object, so we can ensure only proper keys get sent in.
     *
     * The issue here is that the front end field names don't match the DB column name.
     */
    const stubObject = new PrismaModel.ConnectAdvisor({
      userId: '',
      tenantId: '',
      firstName: '',
      lastName: '',
      jobTitle: '',
      countryOfResidence: '',
      businessName: '',
      region: '',
      profileBio: '',
      contactMeReasons: '',
      contactLink: '',
      fullProfileLink: '',
      advisorProfilePictureUrl: null,
      advisorInternalProfilePictureUrl: null,
      createdAt: new Date(),
      createdBy: '',
      updatedAt: new Date(),
      updatedBy: '',
    });
    const validKeys = Object.keys(stubObject);

    Object.keys(advisor).forEach((key) => {
      if (validKeys.includes(key) || key.includes('RichText')) {
        let dbKey: string = key;

        if (dbKey === 'profileBioRichText') {
          dbKey = 'profileBio';
        } else if (dbKey === 'contactMeReasonsRichText') {
          dbKey = 'contactMeReasons';
        }

        updatePayload[dbKey] = (advisor as Record<string, unknown>)[key];
      }
    });

    const result = await this.prisma.connectAdvisor.upsert({
      where: { userId, Tenant: { realm: tenantRealm } },
      create: {
        User: { connect: { id: userId } },
        Tenant: { connect: { realm: tenantRealm } },
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        jobTitle: data.jobTitle || '',
        countryOfResidence: data.countryOfResidence || '',
        businessName: data.businessName || '',
        profileBio: data.profileBioRichText || '',
        contactMeReasons: data.contactMeReasonsRichText || '',
        fullProfileLink: data.fullProfileLink || '',
        advisorProfilePictureUrl: data.advisorProfilePictureUrl,
        advisorInternalProfilePictureUrl: data.advisorInternalProfilePictureUrl,
        createdBy: userId,
        createdAt: timeStamp,
        updatedAt: timeStamp,
        updatedBy: userId,
        region: data.region || '',
      },
      update: {
        ...updatePayload,
        updatedAt: timeStamp,
        updatedBy: userId,
      },
    });
    return result;
  }

  public async UpdateAdvisor(
    advisor: Partial<ConnectAdvisorDto.IConnectAdvisorProfileInformationDto> &
      Pick<
        ConnectAdvisorDto.IConnectAdvisorProfileInformationDto,
        'userId' | 'tenantRealm'
      >
  ): Promise<PrismaModel.ConnectAdvisor | null> {
    // TODO
    const {
      userId,
      tenantRealm,
      profileBioRichText,
      contactMeReasonsRichText,
      ...data
    } = advisor;
    const timeStamp = new Date().toISOString();

    const result = await this.prisma.connectAdvisor.update({
      where: { userId, Tenant: { realm: tenantRealm } },
      data: {
        ...data,
        profileBio: profileBioRichText ?? undefined,
        contactMeReasons: contactMeReasonsRichText ?? undefined,
        updatedAt: timeStamp,
        updatedBy: userId,
      },
    });
    return result;
  }
}
