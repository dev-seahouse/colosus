import { BambuGoProductIdEnum } from '../../../../enums';

export interface IConnectAdvisorProfileInformationSetupStateDto {
  hasUpdatedBranding: boolean;
  hasUpdatedGoals: boolean;
  hasUpdatedPortfolios: boolean;
  hasUpdatedContent: boolean;
  hasUpdatedLeadSettings: boolean;
}

export interface IConnectAdvisorProfileInformationSubscriptionDto {
  productId: string;
  productCode: string;
  subscriptionId: string;
  bambuGoProductId: BambuGoProductIdEnum | null;
  isInterestedInTransact: boolean;
}

export interface IConnectAdvisorProfileInformationDto {
  userId: string; // same as user id
  tenantRealm: string; // same as tenant realm id (e.g. foo_eggs_at_bar_com)
  firstName: string;
  lastName: string;
  jobTitle: string;
  countryOfResidence: string; // ISO 3166-1 alpha-3 (three-letter country codes)
  businessName: string;
  region?: string;
  hasActiveSubscription: boolean;
  profileBioRichText?: string | null;
  contactMeReasonsRichText?: string | null;
  contactLink?: string | null;
  fullProfileLink?: string | null;
  advisorProfilePictureUrl?: string | null;
  advisorInternalProfilePictureUrl?: string | null;
  subscriptions: IConnectAdvisorProfileInformationSubscriptionDto[];
  // TODO: this will be a proper non optional type later
  platformSetupStatus?: IConnectAdvisorProfileInformationSetupStateDto | null;
}

export interface IConnectAdvisorProfileForAdvisorDto
  extends Pick<
    IConnectAdvisorProfileInformationDto,
    | 'firstName'
    | 'lastName'
    | 'tenantRealm'
    | 'profileBioRichText'
    | 'contactMeReasonsRichText'
    | 'jobTitle'
    | 'contactLink'
    | 'fullProfileLink'
    | 'advisorProfilePictureUrl'
  > {
  advisorSubscriptionInPlace: boolean;
}
