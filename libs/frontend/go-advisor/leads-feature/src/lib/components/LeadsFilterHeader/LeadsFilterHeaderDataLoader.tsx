import { useLoaderData, Await } from 'react-router-dom';
import { Suspense } from 'react';

import LeadsFilterHeader from './LeadsFilterHeader';
import LeadsFilterHeaderFallback from './LeadsFilterHeaderFallback';
import type { GetTopLevelOptionsData } from '@bambu/go-advisor-core';

export interface LeadsFilterHeaderLoaderData {
  topLevelOptions: GetTopLevelOptionsData;
}

export const LeadsFilterHeaderDataLoader = () => {
  const initialData = useLoaderData() as LeadsFilterHeaderLoaderData;

  return (
    <Suspense fallback={<LeadsFilterHeaderFallback />}>
      <Await resolve={initialData.topLevelOptions}>
        {(data) => (
          <LeadsFilterHeader
            minimumIncome={data?.incomeThreshold}
            minimumCashSavings={data?.retireeSavingsThreshold}
          />
        )}
      </Await>
    </Suspense>
  );
};

export default LeadsFilterHeaderDataLoader;
