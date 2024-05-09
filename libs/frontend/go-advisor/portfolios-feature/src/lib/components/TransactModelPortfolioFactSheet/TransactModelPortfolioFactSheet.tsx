import { FileUpload, FormControl, Stack, Typography } from '@bambu/react-ui';
import { useParams } from 'react-router-dom';
import { useSelectConnectPortfolioIdByKey } from '../../hooks/useGetConnectPortfolioByKey/useGetConnectPortfolioByKey.selectors';
import { Controller, useFormContext } from 'react-hook-form';
import type { ConfigurePortfolioFormState } from '../ConfigurePortfolioForm/ConfigurePortfolioForm.types';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export function TransactModelPortfolioFactSheet() {
  const isMutating = useIsMutating({
    mutationKey: ['uploadModelPortfolioFactSheet'],
  });
  const isFetching = useIsFetching({
    queryKey: ['getTransactModelPortfolios'],
  });
  const { portfolioType } = useParams();
  const { control } = useFormContext<ConfigurePortfolioFormState>();

  const { data: connectModelPortfolio } = useSelectConnectPortfolioIdByKey(
    portfolioType as string
  );

  if (!connectModelPortfolio) return;

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack spacing={2} sx={{ width: '50%' }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Model Portfolio Factsheet (Optional)
        </Typography>
        <Typography>
          Upload a factsheet that provides your clients with all of the
          important information they need to know about this portfolio. Your
          clients will be able to access this factsheet both before and after
          investing in this portfolio.
        </Typography>
      </Stack>
      <Stack sx={{ paddingRight: 4 }}>
        <Controller
          name={'transact.factSheet'}
          control={control}
          render={({
            field: { onChange, value, ...rest },
            fieldState: { error },
          }) => {
            return (
              <FormControl error={!!error}>
                <Stack spacing={0.5}>
                  <FileUpload
                    {...rest}
                    isRemovable
                    value={value}
                    fileName="fact-sheet.pdf"
                    disabled={!!isMutating || !!isFetching}
                    isLoading={!!isMutating || !!isFetching}
                    showPreview={!value?.hasUploaded || !!value.formData}
                    onDrop={(file) => {
                      onChange({
                        ...file,
                        hasUploaded: false,
                      });
                    }}
                    onRemove={() => {
                      onChange({
                        url: '',
                        formData: null,
                        hasUploaded: false,
                      });
                    }}
                    options={{
                      accept: {
                        'application/pdf': ['.pdf'],
                      },
                      maxSize: 2000000,
                    }}
                    UploadButtonProps={{ label: 'Upload PDF' }}
                    helperText="Max. size: 2MB"
                  />

                  <Typography color={'error'} variant={'caption'}>
                    {error?.message}
                  </Typography>
                </Stack>
              </FormControl>
            );
          }}
        />
      </Stack>
    </Stack>
  );
}

export default TransactModelPortfolioFactSheet;
