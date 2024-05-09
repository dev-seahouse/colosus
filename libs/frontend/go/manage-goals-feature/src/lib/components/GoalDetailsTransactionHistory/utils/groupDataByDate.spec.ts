import { groupDataByDate } from './groupDataByDate';
import type { InvestorBrokerageIntegrationTransactionsListAllResponseDto } from '@bambu/api-client';

describe('groupDataByDate', () => {
  test('groupDataByDate should return an empty object if data is undefined', () => {
    const result = groupDataByDate(undefined);
    assert.deepEqual(result, {});
  });

  test('groupDataByDate should group data by date', () => {
    const data = [
      {
        results: [
          {
            date: '2023-11-20',
            // other properties
          },
          {
            date: '2023-11-21',
            // other properties
          },
          {
            date: '2023-11-20',
            // other properties
          },
        ],
      },
    ];

    const result = groupDataByDate(data as any);

    assert.deepEqual(result, {
      '2023-11-20': [
        {
          date: '2023-11-20',
          // other properties
        },
        {
          date: '2023-11-20',
          // other properties
        },
      ] as any,
      '2023-11-21': [
        {
          date: '2023-11-21',
          // other properties
        },
      ] as any,
    });
  });

  test('groupDataByDate should return an empty object if data is an empty array', () => {
    const data: InvestorBrokerageIntegrationTransactionsListAllResponseDto[] =
      [];

    const result = groupDataByDate(data);

    assert.deepEqual(result, {});
  });

  it('should group and sort the data by date in descending order', () => {
    const data = [
      {
        results: [
          { date: '2022-01-01', value: 1 },
          { date: '2022-01-02', value: 2 },
          { date: '2022-01-01', value: 3 },
        ],
      },
      {
        results: [
          { date: '2022-01-03', value: 4 },
          { date: '2022-01-02', value: 5 },
        ],
      },
    ];

    const result = groupDataByDate(data as any);

    expect(result).toEqual({
      '2022-01-03': [{ date: '2022-01-03', value: 4 }],
      '2022-01-02': [
        { date: '2022-01-02', value: 2 },
        { date: '2022-01-02', value: 5 },
      ],
      '2022-01-01': [
        { date: '2022-01-01', value: 1 },
        { date: '2022-01-01', value: 3 },
      ],
    });
  });
});
