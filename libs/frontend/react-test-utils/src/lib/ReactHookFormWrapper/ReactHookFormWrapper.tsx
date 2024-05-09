import type { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface ReactHookFormWrapperProps {
  children?: ReactNode;
}

// TODO: Add support for passing in defaultValues and options
export const ReactHookFormWrapper = ({
  children,
}: ReactHookFormWrapperProps) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default ReactHookFormWrapper;
