interface IConnectAdvisor {
  userId: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  countryOfResidence: string;
  businessName: string;
  region?: string | null;
  profileBio?: string | null;
  contactMeReasons?: string | null;
  contactLink?: string | null;
  fullProfileLink?: string | null;
  advisorProfilePictureUrl?: string | null;
  advisorInternalProfilePictureUrl?: string | null;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

export class ConnectAdvisor implements IConnectAdvisor {
  userId: string; // same as user id
  tenantId: string; // DB ID of the tenant record. NOT the tenantRealm (tenantRealm is sometimes known as realm or realmId)
  firstName: string;
  lastName: string;
  jobTitle: string;
  countryOfResidence: string; // ISO 3166-1 alpha-3 (three-letter country codes)
  region?: string | null;
  businessName: string;
  profileBio?: string | null;
  contactMeReasons?: string | null;
  contactLink?: string | null;
  fullProfileLink?: string | null;
  advisorProfilePictureUrl?: string | null;
  advisorInternalProfilePictureUrl?: string | null;
  createdBy?: string = 'unknown';
  createdAt?: Date;
  updatedBy?: string = 'unknown';
  updatedAt?: Date;

  constructor(input: IConnectAdvisor) {
    this.userId = input.userId;
    this.tenantId = input.tenantId;
    this.firstName = input.firstName;
    this.lastName = input.lastName;
    this.jobTitle = input.jobTitle;
    this.countryOfResidence = input.countryOfResidence;
    this.region = input.region;
    this.businessName = input.businessName;
    this.profileBio = input.profileBio;
    this.contactMeReasons = input.contactMeReasons;
    this.contactLink = input.contactLink;
    this.fullProfileLink = input.fullProfileLink;
    this.advisorProfilePictureUrl = input.advisorProfilePictureUrl;
    this.advisorInternalProfilePictureUrl =
      input.advisorInternalProfilePictureUrl;
    this.createdBy = input.createdBy;
    this.createdAt = input.createdAt;
    this.updatedBy = input.updatedBy;
    this.updatedAt = input.updatedAt;
  }
}
