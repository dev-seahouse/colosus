import { keyframes, styled } from '@mui/material';
import Typography from '../Typography/Typography';

const LoadingContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
const DotAnimation = keyframes`
  0% {
    content: '';
  }
  25% {
    content: '.';
  }
  50% {
    content: '..';
  }
  75% {
    content: '...';
  }
`;
const LoadingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[400],
  position: 'relative',

  '&:after': {
    content: '""',
    position: 'absolute',
    width: '1ch',
    height: '100%',
    left: 'calc(100% + 5px)',
    top: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    animation: `${DotAnimation} 1.5s infinite`,
  },
}));
export const AnimatedLoadingText = ({
  text = 'loading',
}: {
  text?: string;
} = {}) => {
  return (
    <LoadingContainer>
      <LoadingText>{text} </LoadingText>
    </LoadingContainer>
  );
};
