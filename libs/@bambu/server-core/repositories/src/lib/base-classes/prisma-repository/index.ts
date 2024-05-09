import { Injectable } from '@nestjs/common';
import { getDbRepositoryConfig, IDbRepositoryConfig } from './prisma-db.config';

export interface IPrismaRepositoryMapTypeDto {
  aggregate: unknown;
  count: unknown;
  create: unknown;
  delete: unknown;
  deleteMany: unknown;
  findFirst: unknown;
  findMany: unknown;
  findUnique: unknown;
  update: unknown;
  updateMany: unknown;
  upsert: unknown;
}

export interface IPrismaRepositoryDelegateDto {
  aggregate(data: unknown): unknown;

  count(data: unknown): unknown;

  create(data: unknown): unknown;

  delete(data: unknown): unknown;

  deleteMany(data: unknown): unknown;

  findFirst(data: unknown): unknown;

  findMany(data: unknown): unknown;

  findUnique(data: unknown): unknown;

  update(data: unknown): unknown;

  updateMany(data: unknown): unknown;

  upsert(data: unknown): unknown;
}

@Injectable()
export abstract class PrismaRepository<
  D extends IPrismaRepositoryDelegateDto,
  T extends IPrismaRepositoryMapTypeDto
> {
  readonly #dbRepoConfig: IDbRepositoryConfig;

  constructor(protected delegate: D) {
    this.#dbRepoConfig = getDbRepositoryConfig();
  }

  protected get dbRepoConfig(): IDbRepositoryConfig {
    return this.#dbRepoConfig;
  }

  get #prismaDataFields(): string[] {
    return ['create', 'update', 'data'];
  }

  public getDelegate(): D {
    return this.delegate;
  }

  public async aggregate(data: T['aggregate']) {
    return await this.delegate.aggregate(data);
  }

  public async count(data: T['count']) {
    return await this.delegate.count(data);
  }

  public async create(input: T['create']) {
    this.ensureCreateByAttributesInPlace(input, this.#dbRepoConfig.serviceUser);
    this.ensureUpdateAttributesInPlace(input, this.#dbRepoConfig.serviceUser);

    return await this.getDelegate().create(input);
  }

  protected ensureCreateByAttributesInPlace(input: any, createdBy: string) {
    if (!input) return;

    if (Array.isArray(input)) {
      input.forEach((item) =>
        this.ensureCreateByAttributesInPlace(item, createdBy)
      );
    } else if (typeof input === 'object') {
      Object.keys(input).forEach((key) => {
        if (this.#prismaDataFields.includes(key)) {
          if (!input[key].createdBy) {
            input[key].createdBy = createdBy;
          }
        }
        this.ensureCreateByAttributesInPlace(input[key], createdBy);
      });
    }
  }

  public async delete(data: T['delete']) {
    return await this.delegate.delete(data);
  }

  public async deleteMany(data: T['deleteMany']) {
    return await this.delegate.deleteMany(data);
  }

  public async findFirst(data: T['findFirst']) {
    return await this.delegate.findFirst(data);
  }

  public async findMany(data: T['findMany']) {
    return await this.delegate.findMany(data);
  }

  public async findUnique(data: T['findUnique']) {
    return await this.delegate.findUnique(data);
  }

  public async update(input: T['update']) {
    this.ensureUpdateAttributesInPlace(
      (input as any).data,
      this.#dbRepoConfig.serviceUser
    );

    return await this.delegate.update(input);
  }

  public async updateMany(input: T['updateMany']) {
    this.ensureUpdateAttributesInPlace(
      (input as any).data,
      this.#dbRepoConfig.serviceUser
    );

    return await this.delegate.updateMany(input);
  }

  protected ensureUpdateAttributesInPlace(input: any, updatedBy: string) {
    if (!input) return;

    if (Array.isArray(input)) {
      input.forEach((item) =>
        this.ensureUpdateAttributesInPlace(item, updatedBy)
      );
    } else if (typeof input === 'object') {
      Object.keys(input).forEach((key) => {
        if (this.#prismaDataFields.includes(key)) {
          if (!input[key].updatedBy) {
            input[key].updatedBy = updatedBy;
          }
        }
        this.ensureUpdateAttributesInPlace(input[key], updatedBy);
      });
    }
  }

  // public async upsert(input: T['upsert']) {
  //   this.ensureCreateByAttributesInPlace(input, this.#dbRepoConfig.serviceUser);
  //   this.ensureUpdateAttributesInPlace(input, this.#dbRepoConfig.serviceUser);
  //
  //   return await this.delegate.upsert(input);
  // }
}
