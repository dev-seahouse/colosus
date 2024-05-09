import { Card, CardContent } from '@bambu/react-ui';
import SkeletonLoading from '../SkeletonLoading/SkeletonLoading';

// TODO: auto detect loading status
export function LoadingCard() {
  return (
    <Card>
      <CardContent>
        <SkeletonLoading variant={'small'} />
      </CardContent>
    </Card>
  );
}

export default LoadingCard;
