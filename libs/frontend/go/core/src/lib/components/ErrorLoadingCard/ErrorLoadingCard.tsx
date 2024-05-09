import { Card, CardContent, ErrorLoadingData } from '@bambu/react-ui';

// TODO: add auto detect http error
export function ErrorLoadingCard() {
  return (
    <Card>
      <CardContent>
        <ErrorLoadingData />
      </CardContent>
    </Card>
  );
}

export default ErrorLoadingCard;
