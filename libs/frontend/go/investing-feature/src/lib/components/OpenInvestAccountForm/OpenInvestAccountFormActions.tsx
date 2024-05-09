import { useGoBack } from '@bambu/go-core';
import { Button, Stack } from '@bambu/react-ui';

export function OpenInvestAccountFormActions({
  isLoading,
}: {
  isLoading?: boolean;
}) {
  const goBack = useGoBack();
  return (
    <Stack
      direction={'row'}
      py={[3, 3, 5]}
      spacing={2}
      alignItems={'flex-end'}
      justifyContent={'flex-end'}
    >
      <Button
        type="button"
        onClick={goBack}
        variant="outlined"
        sx={{ flex: [1, 0] }}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        sx={{ flex: [1, 0] }}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Submit' : 'Submit'}
      </Button>
    </Stack>
  );
}
