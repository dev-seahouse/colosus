import { useLoaderData, Await } from 'react-router-dom';
import { Suspense } from 'react';

import LeadsSettingForm from './LeadsSettingForm';
import LeadsSettingFormFallback from './LeadsSettingFormFallback';
import type { GetTopLevelOptionsData } from '@bambu/go-advisor-core';

export interface LeadsSettingFormLoaderData {
  topLevelOptions: GetTopLevelOptionsData;
}

export const LeadsSettingFormDataLoader = () => {
  const initialData = useLoaderData() as LeadsSettingFormLoaderData;

  return (
    <Suspense fallback={<LeadsSettingFormFallback />}>
      <Await resolve={initialData.topLevelOptions}>
        {(data: LeadsSettingFormLoaderData['topLevelOptions']) => (
          <LeadsSettingForm
            initialIncomeThreshold={data?.incomeThreshold}
            initialRetireeSavingsThreshold={data?.retireeSavingsThreshold}
          />
        )}
      </Await>
    </Suspense>
  );
};

export default LeadsSettingFormDataLoader;
