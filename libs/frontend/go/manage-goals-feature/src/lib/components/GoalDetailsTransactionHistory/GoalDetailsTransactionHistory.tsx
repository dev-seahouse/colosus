import React, { useMemo } from 'react';

import { DateTime } from 'luxon';
import { useInView } from 'react-intersection-observer';

import {
  AnimatedLoadingText,
  ErrorLoadingData,
  Skeleton,
  Stack,
  Typography,
} from '@bambu/react-ui';

import { useInfiniteGetTransactionsForGoal } from '../../hooks/useGetTransactionsForGoal/useGetTransactionsForGoal';
import EmptyTransaction from '../EmptyTransaction/EmptyTransaction';
import GoalDetailsTransactionHistoryItem from '../GoalDetailsTransactionHistoryItem/GoalDetailsTransactionHistoryItem';
import { groupDataByDate } from './utils/groupDataByDate';

export function GoalDetailsTransactionHistory({
  goalId,
}: {
  goalId: string | undefined;
}) {
  const { ref, inView } = useInView({
    initialInView: false,
  });

  const {
    data: goalTransactionHistory,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteGetTransactionsForGoal({
    goalId: goalId ?? '',
    limit: 10,
    startDate: DateTime.now().minus({ days: 90 }).toISODate(),
    endDate: DateTime.now().toISODate(),
  });
  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  const groupedData = useMemo(
    () => Object.entries(groupDataByDate(goalTransactionHistory?.pages)),
    [goalTransactionHistory?.pages]
  );

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack spacing={2}>
        <ErrorLoadingData />
      </Stack>
    );
  }

  if (!goalTransactionHistory?.pages?.length) {
    return (
      <Stack spacing={2}>
        <EmptyTransaction />
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      {React.Children.toArray(
        groupedData.map(([date, items]) => (
          <Stack spacing={'3px'}>
            <Typography
              variant={'caption'}
              letterSpacing={'0.5px'}
              fontWeight={'bold'}
            >
              {DateTime.fromISO(date).toFormat('dd/MM/yyyy')}
            </Typography>
            <Stack spacing={1}>
              {items.map((item, idx) => {
                return (
                  <GoalDetailsTransactionHistoryItem
                    key={item.id}
                    amount={item.consideration.amount}
                    type={item.type}
                    ref={idx === items.length - 2 ? ref : undefined}
                  />
                );
              })}
            </Stack>
          </Stack>
        ))
      )}
      {isFetchingNextPage ? <AnimatedLoadingText /> : null}
    </Stack>
  );
}

export default GoalDetailsTransactionHistory;
