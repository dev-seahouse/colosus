import { Autocomplete, InputAdornment, TextField } from '@bambu/react-ui';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchTransactInstruments } from '../../hooks/useGetTransactInstruments/useGetTransactInstruments';
import type { AdvisorGetInstrumentsResponseDto } from '@bambu/api-client';
import type { TransactAssetAllocationItem } from '../TransactAssetAllocationTable/TransactAssetAllocationTable.types';
import type { UseControllerProps } from 'react-hook-form';
import {
  type FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

interface InstrumentSearchInputProps<T extends FieldValues>
  extends UseControllerProps<T> {
  onSelected?: (v: Omit<TransactAssetAllocationItem, 'weightage'>) => void;
  onChange?: (e: React.SyntheticEvent, v: any) => void;
}

export function InstrumentsSearchInput<T extends FieldValues>(
  props: InstrumentSearchInputProps<T>
) {
  const { getValues } = useFormContext();
  const selectedValues: Array<TransactAssetAllocationItem> = getValues(
    'transact.instruments'
  );
  const { onSelected, onChange, ...rest } = props;
  const { field } = useController(rest);
  const [{ data, isFetching }, { setSearchString }] =
    useSearchTransactInstruments({
      select: selectProductTableItems,
    });

  function handleInputChange(e: React.SyntheticEvent, v: string) {
    setSearchString(v);
  }

  function handleChange(
    e: React.SyntheticEvent,
    v: Omit<TransactAssetAllocationItem, 'weightage'>,
    reason: string
  ) {
    if (reason === 'selectOption') {
      props.onSelected && props.onSelected(v);
    }
    field.onChange(v);
  }

  return (
    <Autocomplete
      popupIcon={null}
      placeholder="Search for instruments"
      options={data || []}
      loading={isFetching}
      onChange={handleChange}
      filterOptions={(x) => {
        const selectedValuesKeys = selectedValues?.map((v) => v.name);
        return x.filter((v) => !selectedValuesKeys?.includes(v.name));
      }}
      onInputChange={handleInputChange}
      disableClearable
      noOptionsText="No products found"
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={(input) => input && input.focus()}
          type={'search'}
          variant={'standard'}
          size={'small'}
          sx={{
            '.Mui-focused .MuiSvgIcon-root': {
              color: 'primary.main',
            },
            '& .MuiInputBase-input::-webkit-search-cancel-button': {
              appearance: 'none',
            },
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  aria-label={'perform search'}
                  fontSize={'small'}
                  sx={{
                    color: '#B9B9B9',
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}

function selectProductTableItems(
  res: AdvisorGetInstrumentsResponseDto
): Array<Omit<TransactAssetAllocationItem, 'weightage'>> {
  return res.data.map((item) => {
    return {
      instrumentId: item.id,
      ticker: item.bloombergTicker ?? '-',
      name: item.name,
      currency: item.InstrumentCurrency?.iso4217Code ?? '-',
      type: item.InstrumentAssetClass?.name ?? '-',
    };
  });
}

export default InstrumentsSearchInput;
