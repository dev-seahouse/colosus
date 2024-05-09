import {
  Divider,
  TextField,
  Stack,
  Typography,
  PercentageField,
} from '@bambu/react-ui';
import { useFormContext, Controller } from 'react-hook-form';

import PortfolioSection from '../PortfolioSection/PortfolioSection';
import type { ConfigurePortfolioFormState } from '../ConfigurePortfolioForm/ConfigurePortfolioForm.types';
import { MAX_CHARACTERS } from '../ConfigurePortfolioForm/ConfigurePortolioform.schema';

export function PortfolioDetails() {
  const {
    control,
    register,
    formState: { errors },
    watch,
  } = useFormContext<ConfigurePortfolioFormState>();

  const description = watch('description');
  const exceedMaxCharacters = description.length > MAX_CHARACTERS;

  return (
    <PortfolioSection title="Portfolio Details">
      <Stack spacing={3}>
        <Stack spacing={1}>
          <TextField
            {...register('name')}
            inputProps={{
              'data-testid': 'portfolio-name-input',
            }}
            label="Portfolio name"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <Typography variant="caption">
            This name will be used to identify the portfolio in your portfolio
            list
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <TextField
            {...register('description')}
            inputProps={{
              'data-testid': 'portfolio-desc-input',
              maxLength: MAX_CHARACTERS,
            }}
            label="Portfolio description"
            multiline
            rows={6}
            error={!!errors.description}
            helperText={
              errors.description?.type === 'too_big'
                ? null
                : errors.description?.message
            }
          />
          <Typography
            variant="caption"
            textAlign="right"
            color={exceedMaxCharacters ? 'error' : 'default'}
          >
            {description.length}/{MAX_CHARACTERS} characters
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Controller
            render={({ field: { value, onChange, onBlur } }) => (
              <PercentageField
                sx={{ width: '100%' }}
                allowNegative={false}
                label="Expected Return"
                placeholder="Expected Return"
                value={value}
                onBlur={onBlur}
                onValueChange={(e) => onChange(e.floatValue ?? '')}
                error={!!errors.expectedReturnPercent}
                helperText={errors.expectedReturnPercent?.message}
              />
            )}
            name="expectedReturnPercent"
            control={control}
            rules={{ required: true }}
          />
          <Controller
            render={({ field: { value, onChange, onBlur } }) => (
              <PercentageField
                sx={{ width: '100%' }}
                allowNegative={false}
                label="Expected Volatility"
                placeholder="Expected Volatility"
                value={value}
                onBlur={onBlur}
                onValueChange={(e) => onChange(e.floatValue ?? '')}
                error={!!errors.expectedVolatilityPercent}
                helperText={errors.expectedVolatilityPercent?.message}
              />
            )}
            name="expectedVolatilityPercent"
            control={control}
            rules={{ required: true }}
          />
        </Stack>
        <Divider />
      </Stack>
    </PortfolioSection>
  );
}

export default PortfolioDetails;
