import { InputAdornment, TextField } from '@bambu/react-ui';
import { useId } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { forwardRef, useState } from 'react';
import type { TextFieldProps } from '@bambu/react-ui';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { useCallback } from 'react';

type SearchBarProps = TextFieldProps & {
  onCancelSearch?: (e: MouseEvent<HTMLButtonElement>) => void;
  // how long should input be debounced
  timeoutMs?: number;
};

export const SearchBox = forwardRef(function (
  {
    name,
    label = 'Search lead by name',
    value: controlledValue,
    onChange: propOnChange,
    onCancelSearch: propOnCancelSearch,
    disabled,
    variant,
    ...rest
  }: SearchBarProps,
  ref
) {
  const textBoxId = useId();
  const [ownState, setOwnState] = useState('');
  const isControlled = controlledValue != null;
  const value = isControlled ? controlledValue : ownState;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setOwnState(e.target.value.trim());
      }
      propOnChange && propOnChange(e);
    },
    [isControlled, propOnChange]
  );

  const handleCancelSearch = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (!isControlled) {
        setOwnState('');
      }
      propOnCancelSearch && propOnCancelSearch(e);
    },
    [isControlled, propOnCancelSearch]
  );

  return (
    <TextField
      id={`search-box-${textBoxId}`}
      label={label}
      inputRef={ref}
      value={value}
      fullWidth
      disabled={disabled}
      size="small"
      onChange={handleChange}
      variant={variant}
      sx={{
        '& .MuiInputBase-input::-webkit-search-cancel-button': {
          appearance: 'none',
        },
      }}
      InputProps={{
        type: 'search',
        inputProps: {
          'aria-description': 'search results will appear below',
        },
        endAdornment: (
          <InputAdornment position="end">
            {value !== '' ? (
              <IconButton
                aria-label="clear value"
                edge="end"
                disabled={disabled}
                onClick={handleCancelSearch}
              >
                <ClearIcon />
              </IconButton>
            ) : (
              <IconButton
                aria-label="perform search"
                edge="end"
                disabled={disabled}
                disableRipple
              >
                <SearchIcon sx={{ color: '#B9B9B9' }} />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
    />
  );
});

export default SearchBox;
