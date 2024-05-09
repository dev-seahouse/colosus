import React from 'react';
import { useSelectAdvisorFullNameQuery } from '@bambu/go-core';
import {
  FormControl,
  FormControlLabel,
  Typography,
  Stack,
  MuiLink,
  styled,
  Radio,
  RadioGroup,
} from '@bambu/react-ui';

export const options = [
  {
    index: 0,
    value:
      "I'm seeking guidance from an  advisor to level up my investment strategy",
  },
  {
    index: 1,
    value: "I'm interested in investing with robo-advisor",
  },
];

type ButtonLabelProps = {
  selected: boolean;
};

const OptionContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'selected',
})<ButtonLabelProps>(({ theme, selected }) => ({
  border: selected
    ? `1px solid ${theme.palette.primary.main}`
    : '1px solid #E5E7EB',
  borderRadius: '4px',
  padding: '1rem',
  marginLeft: 'none',
  position: 'relative',
  backgroundColor: selected ? '#CEE9DC' : '',
}));

export interface InvestmentOptionsProps {
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InvestmentOptions({
  handleChange,
  value,
}: InvestmentOptionsProps) {
  const optionToExpand = value === options[0].value;
  const { data: fullName } = useSelectAdvisorFullNameQuery();

  return (
    <FormControl fullWidth>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        <Stack spacing={2}>
          {options.map((option, i) => {
            const selectedOption = options[i].value === value;
            return (
              <OptionContainer selected={selectedOption}>
                <FormControlLabel
                  value={option.value}
                  label={
                    <Stack
                      spacing={4}
                      sx={{
                        marginRight: '3rem',
                      }}
                    >
                      <Typography>{option.value}</Typography>
                      {optionToExpand && selectedOption ? (
                        <Stack spacing={1}>
                          <Stack>
                            <Typography sx={{ fontWeight: '700' }}>
                              Meet our financial advisor!
                            </Typography>
                            <Typography>
                              Hi there, I’m {fullName ?? '-'}. Let’s work
                              together to bridge the financial gap and achieve
                              your goals.
                            </Typography>
                          </Stack>
                          <MuiLink
                            underline="always"
                            href=""
                            rel="noopener"
                            sx={{ fontSize: '12px' }}
                          >
                            View more
                          </MuiLink>
                        </Stack>
                      ) : null}
                    </Stack>
                  }
                  sx={{ marginLeft: '0' }}
                  control={
                    <Radio
                      sx={{
                        position: 'absolute',
                        top: '10px',
                        right: '5px',
                      }}
                    />
                  }
                  labelPlacement="start"
                />
              </OptionContainer>
            );
          })}
        </Stack>
      </RadioGroup>
    </FormControl>
  );
}
