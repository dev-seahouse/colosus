import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/react';
import type { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { UseFormProps } from 'react-hook-form';

type UseFormDefaultValues = UseFormProps['defaultValues'];

interface StoryFormProviderProps {
  children?: ReactNode;
  defaultValues?: UseFormDefaultValues;
}

const StorybookFormProvider = ({
  children,
  defaultValues,
}: StoryFormProviderProps) => {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(action('[React Hooks Form] Submit'))}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export const hookFormDecorator =
  (defaultValues?: UseFormDefaultValues) => (Story: StoryFn) =>
    (
      <StorybookFormProvider defaultValues={defaultValues}>
        <Story />
      </StorybookFormProvider>
    );
