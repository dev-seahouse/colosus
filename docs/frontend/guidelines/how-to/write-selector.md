# How to write a selector?

## Server State Selector (via react query)

**Naming Convention**

- a React query selector should be named with `useSelect` prefix and `Query` suffix, e.g: `useSelectUsernameQuery`;

```typescript
const useSelectUsernameQuery = () => {
  return useQuery({
    queryKey: 'someQueryKey', // query key,
    queryFn: someQueryFn, // queryFn,
    select: (data: SomeData) => data.username,
  });
};
```

## Client State Selector (via zustand)

**Naming Convention**

- a zustand selector (hook) should be named with `useSelect` prefix, e.g: `useSelectUsername`;
- a zustand selector (non-hook) should be named with `select` prefix, e.g: `selectUsername`;

```typescript
// hook based zustand selector
const useSelectUsername = () => {
  const username = useStore((state) => state.username);
  return username;
};

// non hook based zustand selector
const selectUsername = () => {
    const username = useStore.getState().username;
    
    return username;
};
```
