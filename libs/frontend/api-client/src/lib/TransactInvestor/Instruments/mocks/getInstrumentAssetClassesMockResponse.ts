import type { InvestorGetInstrumentAssetClassesResponseDto } from '../Instruments';

export const getInstrumentAssetClassesMockResponse = {
  createdAt: new Date('2023-10-21T11:05:04.443Z'),
  createdBy: 'string',
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'string',
  updatedAt: new Date('2023-10-21T11:05:04.443Z'),
  updatedBy: 'string',
  // Instruments: [] missing from swagger
} satisfies InvestorGetInstrumentAssetClassesResponseDto;
