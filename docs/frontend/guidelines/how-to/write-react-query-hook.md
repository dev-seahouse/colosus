# How to write a React Query hook?

**Placement of React Query hooks**

React Query hooks should be placed in the `hooks` folder inside your lib/app, e.g: `src/lib/hooks/`.

**Naming of React Query hooks**

The hook should be named with `use` prefix, e.g: `useProfile`.

**Define a query function for reusability**

```typescript
// for useQuery
export const getProfileDetailsQuery = () => ({
  queryKey: ['getProfileDetails'],
  queryFn: async () => {
    const res = await ConnectAdvisorProfileApi.getProfile();

    return res.data;
  },
});

// for useMutation
export const updateProfileDetailsQuery = () => ({
  mutationKey: ['updateProfileDetails'],
  mutationFn: async (req: ConnectAdvisorUpdateProfileRequestDto) => {
    const res = await ConnectAdvisorProfileApi.updateProfile(req);

    return res.data;
  },
});
```

**Write a custom useQuery/useMutation hook**

and use the query function defined.

```typescript
// useMutation
export function useUpdateProfileDetails() {
  return useMutation(
    updateProfileDetailsQuery().mutationKey,
    updateProfileDetailsQuery().mutationFn,
  );
}

// useQuery
export function useGetProfileDetails() {
  return useQuery(getProfileDetailsQuery());
}
```

**(Optional) Define loader if you use react-router-dom loader**

```typescript
export const getProfileDetailsLoader =
  (queryClient: QueryClient) => async (): Promise<GetProfileDetailsData> => {
    const query = getProfileDetailsQuery();
    
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };
```
