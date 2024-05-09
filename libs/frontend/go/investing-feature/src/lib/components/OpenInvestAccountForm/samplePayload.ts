const notFinalSamplePayload = {
  party: {
    type: 'Person', // For now it will always be person, hard coded
    clientReference: 'BenFirstAccount', // BE will populate this
    identifiers: [
      {
        issuer: 'GB', // Fixed value for 1st release
        type: 'NINO', // Fixed value for 1st release
        value: 'QQ123456A',
      },
    ],
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
    employmentStatus: 'FullTime',
    industry: 'AgricultureForestryAndFishing',
    sourcesOfWealth: ['Salary', 'Inheritance'],
    annualIncome: {
      currency: 'GBP', // Fixed value for 1st release
      amount: 30000,
    },
  },
  address: {
    partyId: 'pty-33wdlwrpd23vji', // BE will populate this
    clientReference: '5gj85gnkfgd', // BE will populate this
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
    clientReference: 'My Client Ref', // BE will populate this
    name: 'Example Account', // BE will populate this
    type: 'GIA',
    productId: 'prd-gia', // Fixed value for 1st release
    owner: 'pty-33xk677aw2egkm', // BE will populate this
  },
};
