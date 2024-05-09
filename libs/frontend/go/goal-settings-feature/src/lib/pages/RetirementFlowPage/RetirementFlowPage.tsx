import { Header } from '@bambu/go-core';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import GoalSettingsLayout from '../../layouts/GoalSettingsLayout/GoalSettingsLayout';
import useGetCountryRate from '../../hooks/useGetCountryRate/useGetCountryRate';
import type { GetCountryRateData } from '../../hooks/useGetCountryRate/useGetCountryRate';

export interface RetirementFlowPageProps {
  children?: ReactNode;
  initialData?: {
    countryRate: GetCountryRateData;
  };
}

export function RetirementFlowPage({
  children = <Outlet />,
  initialData,
}: RetirementFlowPageProps) {
  const { isInitialLoading } = useGetCountryRate({
    ...(initialData?.countryRate && { initialData: initialData.countryRate }),
  });

  if (isInitialLoading) {
    return null;
  }

  return (
    <>
      <Header />
      <GoalSettingsLayout title="Retire comfortably" goalType="Retirement">
        {children}
      </GoalSettingsLayout>
    </>
  );
}

export default RetirementFlowPage;
