import type { InvestorBrokerageApiRequestDto } from '../Brokerage';
import {
  InvestorBrokerageAccountTypeEnum,
  InvestorBrokerageEmploymentStatusEnum,
  InvestorBrokerageIndustryEnum,
  InvestorBrokerageSourcesOfWealthEnum,
} from '../Brokerage.enum';

export const submitKycToBrokerageMockRequest = {
  party: {
    type: 'Person',
    identifiers: [
      {
        issuer: 'GB',
        type: 'NINO',
        value: 'QQ123456A',
      },
    ],
    countryOfBirth: null,
    dateOfDeath: null,
    title: 'Mr',
    forename: 'Benjamin',
    middlename: "'Stutter'",
    surname: 'Wong',
    previousSurname: null,
    emailAddress: 'benjain@bambu.co',
    telephoneNumber: '+60122678138',
    dateOfBirth: '1985-10-01',
    taxResidencies: ['GB'],
    nationalities: ['GB'],
    employmentStatus: InvestorBrokerageEmploymentStatusEnum.FULL_TIME,
    industry: InvestorBrokerageIndustryEnum.AGRICULTURE_FORESTRY_AND_FISHING,
    sourcesOfWealth: [InvestorBrokerageSourcesOfWealthEnum.SALARY],
    annualIncome: {
      currency: 'GBP',
      amount: 30000,
    },
  },
  address: {
    line1: '44 St Martins Road',
    line2: null,
    line3: null,
    city: 'Ponders End',
    region: null,
    postalCode: 'EN3 8PH',
    countryCode: 'GB',
    startDate: null,
    endDate: null,
  },
  account: {
    type: InvestorBrokerageAccountTypeEnum.GIA,
    productId: 'prd-gia',
  },
} satisfies InvestorBrokerageApiRequestDto;
