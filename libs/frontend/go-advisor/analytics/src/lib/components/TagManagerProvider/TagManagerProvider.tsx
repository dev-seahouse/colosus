import { GTMProvider } from '@elgorditosalsero/react-gtm-hook';
import type { ReactNode, ComponentProps } from 'react';

export type GTMProviderProps = ComponentProps<typeof GTMProvider>;

export interface TagManagerProviderProps {
  children: ReactNode;
  params?: GTMProviderProps['state'];
}

export const TagManagerProvider = ({
  children,
  params,
}: TagManagerProviderProps) => {
  return (
    <GTMProvider {...(params?.id && { state: params })} children={children} />
  );
};

export default TagManagerProvider;
