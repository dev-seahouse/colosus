import { InvestmentStyleListItem } from '@bambu/go-core';
import { FormControl, FormHelperText, List } from '@bambu/react-ui';
import type { IAnswer } from '@bambu/shared';
import type { ReactNode } from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
import { useController } from 'react-hook-form';

interface InvestmentStyleListAnswers extends IAnswer {
  title: ReactNode;
  description?: ReactNode;
}

interface InvestmentStyleListControlProps<T extends FieldValues>
  extends UseControllerProps<T> {
  questionnaireAnswers: InvestmentStyleListAnswers[];
}

export function InvestmentStyleListControl<T extends FieldValues>({
  questionnaireAnswers,
  ...props
}: InvestmentStyleListControlProps<T>) {
  const { field, fieldState } = useController(props);
  const { onChange, value } = field;

  return (
    <FormControl fullWidth>
      <List aria-label="investment style questionnaire">
        {questionnaireAnswers.map((answer) => {
          return (
            <InvestmentStyleListItem
              title={answer.title}
              description={answer.description}
              key={answer.id}
              id={answer.id}
              onSelect={onChange}
              selected={value === answer.id}
              capitalize={false}
            />
          );
        })}
      </List>
      {/** Will need to speak to design about the error toast notification as other forms are displaying the error at the bottom for the form. For consistency. */}
      {fieldState.error && (
        <FormHelperText error>{fieldState.error.message}</FormHelperText>
      )}
    </FormControl>
  );
}

export default InvestmentStyleListControl;
