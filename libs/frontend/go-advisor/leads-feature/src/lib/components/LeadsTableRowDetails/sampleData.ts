import type { IGenericDataSummaryDto } from '@bambu/shared';
import { SharedEnums } from '@bambu/shared';
export const sampleData = [
  {
    displayName: 'User Details',
    key: 'USER_DETAILS',
    fields: [
      {
        displayName: 'Name',
        key: 'NAME',
        type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
        value: 'Lilah Ascrofte',
      },
      {
        displayName: 'Status',
        key: 'STATUS',
        type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
        value: 'NEW',
      },
    ],
  },
  {
    displayName: 'Contact Details',
    key: 'CONTACT_DETAILS',
    fields: [
      {
        displayName: 'Email',
        key: 'EMAIL',
        type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
        value: 'lascroftek@tiny.cc',
      },
      {
        displayName: 'Phone Number',
        key: 'PHONE_NUMBER',
        type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
        value: '438-919-5400',
      },
    ],
  },
  {
    displayName: 'Personal Details',
    key: 'PERSONAL_DETAILS',
    fields: [
      {
        displayName: 'Zip Code',
        key: 'ZIP_CODE',
        type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
        value: '216134',
      },
      {
        displayName: 'Age',
        key: 'AGE',
        type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
        value: '34',
      },
      {
        displayName: 'Investment Style',
        key: 'INVESTMENT_STYLE',
        type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
        value: 'CONSERVATIVE',
      },
      {
        displayName: 'Annual Income',
        key: 'ANNUAL_INCOME',
        type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
        value: '201360',
      },
    ],
  },
  {
    displayName: 'Goal Details',
    key: 'GOAL_DETAILS',
    fields: [
      {
        displayName: 'Type',
        key: 'GOAL_TYPE',
        type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
        value: 'Growing Wealth',
      },
      {
        displayName: 'Target Year',
        key: 'TARGET_YEAR',
        type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
        value: '7.5',
      },
      {
        displayName: 'Current Monthly Expenses',
        key: 'MONTHLY_EXPENSES',
        type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
        value: '2127',
      },
      {
        displayName: 'Target Goal',
        key: 'TARGET_GOAL',
        type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
        value: '4252',
      },
      {
        displayName: 'Suggested Contribution',
        key: 'SUGGESTED_CONTRIBUTION',
        type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
        value: '2127',
      },
      {
        displayName: 'Recommended Portfolio',
        key: 'RECOMMENDED_PORTFOLIO',
        type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
        value: 'Conservative Portfolio',
      },
    ],
  },
] satisfies Array<IGenericDataSummaryDto>;
