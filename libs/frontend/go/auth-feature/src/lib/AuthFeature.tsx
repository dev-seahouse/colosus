import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface AuthFeatureProps {}

const StyledAuthFeature = styled.div`
  color: pink;
`;

export function AuthFeature(props: AuthFeatureProps) {
  return (
    <StyledAuthFeature>
      <h1>Welcome to AuthFeature!</h1>
    </StyledAuthFeature>
  );
}

export default AuthFeature;
