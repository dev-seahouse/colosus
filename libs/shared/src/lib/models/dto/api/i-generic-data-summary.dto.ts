import {
  EnumGenericDataSummaryFieldFormat,
  EnumGenericDataSummaryFieldType,
} from '../../../enums';

export interface IGenericDataSummaryDto {
  displayName: string;
  key: string;
  fields: IGenericDataSummaryFieldDto[];
}

export interface IGenericDataSummaryFieldDto {
  displayName: string;
  key: string;
  value: string;
  type: EnumGenericDataSummaryFieldType;
  format?: EnumGenericDataSummaryFieldFormat;
  formatMask?: string;
}
