import { useSearchParams } from 'react-router-dom';

export const useEmailSearchParams = () => {
  const [searchParams] = useSearchParams();
  const emailSent = searchParams.has('email')
    ? searchParams.get('email') === 'true'
    : false;

  return emailSent;
};

export default useEmailSearchParams;
