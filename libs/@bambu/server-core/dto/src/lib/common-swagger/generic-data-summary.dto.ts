import {
  IGenericDataSummaryDto,
  IGenericDataSummaryFieldDto,
  SharedEnums,
} from '@bambu/shared';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

const displayNameOptions: ApiPropertyOptions = {
  type: 'string',
  required: true,
  description: 'Display name of the data summary section/field.',
};

const keyOptions: ApiPropertyOptions = {
  type: 'string',
  required: true,
  description: `Key of the data summary section/field. This key is used to identify the data summary section/field.`,
};

export class GenericDataSummaryFieldDto implements IGenericDataSummaryFieldDto {
  @ApiProperty(displayNameOptions)
  displayName: string;

  @ApiProperty(keyOptions)
  key: string;

  @ApiProperty({
    type: 'string',
    enum: SharedEnums.EnumGenericDataSummaryFieldType,
    description: `Type of the field. Accepted values are: ${Object.values(
      SharedEnums.EnumGenericDataSummaryFieldType
    )}.`,
    required: true,
  })
  type: SharedEnums.EnumGenericDataSummaryFieldType;

  @ApiProperty({
    type: 'string',
    enum: SharedEnums.EnumGenericDataSummaryFieldFormat,
    description: `Type of the field format. Accepted values are: ${Object.values(
      SharedEnums.EnumGenericDataSummaryFieldFormat
    )}.`,
    required: false,
  })
  format?: SharedEnums.EnumGenericDataSummaryFieldFormat;

  @ApiProperty({
    type: 'string',
    description: [
      `Format mask for the field.`,
      'This is used for specialized string formatting.',
      'This is here for future use to enable specialized formatting for fields.',
    ].join(''),
    required: false,
  })
  formatMask?: string;

  @ApiProperty({
    type: 'string',
    description: [
      'Value of the field.',
      'This is always returned of string',
      'For an understanding on how it is meant to be rendered, see the "type" field.',
    ].join(''),
  })
  value: string;
}

export class GenericDataSummaryDto implements IGenericDataSummaryDto {
  @ApiProperty(displayNameOptions)
  displayName: string;

  @ApiProperty(keyOptions)
  key: string;

  @ApiProperty({
    type: GenericDataSummaryFieldDto,
    isArray: true,
    description: 'Fields in section.',
  })
  fields: GenericDataSummaryFieldDto[];
}
