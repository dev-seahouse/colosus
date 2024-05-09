import type { TLeadsTypes } from '@bambu/api-client';
import { LEADS_TYPES } from '@bambu/api-client';
import type { PaginationState } from '@tanstack/react-table';
import { useDeferredValue, useMemo, useState } from 'react';

function useLeadsTableStates() {
  const [filter, setFilter] = useState<TLeadsTypes>(LEADS_TYPES.QUALIFIED);
  const [search, setSearch] = useState<string>('');

  const debouncedSearch = useDeferredValue(search);

  const [{ pageIndex, pageSize }, setPaginationState] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  return {
    filter,
    setFilter,
    search,
    debouncedSearch,
    setSearch,
    pageIndex,
    pageSize,
    setPaginationState,
    pagination,
  };
}

export default useLeadsTableStates;
