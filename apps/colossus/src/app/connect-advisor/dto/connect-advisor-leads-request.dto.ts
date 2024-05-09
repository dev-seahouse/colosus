import { ConnectLeadsDto, SharedEnums } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ConnectAdvisorLeadsRequestSortingDto
  implements ConnectLeadsDto.IConnectAdvisorLeadsApiRequestSortingItemDto
{
  columnName: string;

  @ApiProperty({
    type: 'string',
    enum: SharedEnums.EnumSortOrder,
    required: true,
    description: 'The sort order for the column.',
    default: 'asc',
  })
  @IsNotEmpty()
  @IsEnum(SharedEnums.EnumSortOrder)
  sortOrder: SharedEnums.EnumSortOrder;
}

export class ConnectAdvisorLeadsRequestDto
  implements ConnectLeadsDto.IConnectAdvisorLeadsApiRequestDto
{
  @ApiProperty({
    type: 'number',
    example: '10',
    description: 'The number of items to display in a page.',
    required: true,
  })
  @IsNotEmpty()
  @IsPositive()
  pageSize: number;

  @ApiProperty({
    type: 'number',
    example: '1',
    description: 'The zero-indexed page.',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  pageIndex: number;

  @ApiProperty({
    type: 'string',
    example: 'Smi',
    description: 'A filter for the lead name.',
    required: false,
  })
  @IsString()
  nameFilter: string;

  @ApiProperty({
    type: 'string',
    example: 'ALL',
    description:
      'An string (ALL, QUALIFIED, TRANSACT) to specify whether to show all leads, leads qualified for a meeting, or leads interested in Transact.',
    required: true,
    enum: SharedEnums.LeadsEnums.EnumLeadsQualifiedFilter,
  })
  @IsNotEmpty()
  @IsEnum(SharedEnums.LeadsEnums.EnumLeadsQualifiedFilter)
  qualifiedFilter: SharedEnums.LeadsEnums.EnumLeadsQualifiedFilter;

  @ApiProperty({
    type: ConnectAdvisorLeadsRequestSortingDto,
    isArray: true,
    description: 'The sorting criteria for the results.',
    required: false,
    default: [
      {
        sortOrder: SharedEnums.EnumSortOrder.DESC,
        columnName: 'updatedAt',
      },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ConnectAdvisorLeadsRequestSortingDto)
  sortOrder?: ConnectAdvisorLeadsRequestSortingDto[] = [
    {
      sortOrder: SharedEnums.EnumSortOrder.DESC,
      columnName: 'updatedAt',
    },
  ];
}
