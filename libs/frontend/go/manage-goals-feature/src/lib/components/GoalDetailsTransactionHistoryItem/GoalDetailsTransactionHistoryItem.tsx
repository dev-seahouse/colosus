import { CurrencyText } from '@bambu/go-core';
import { Card, CardContent, Typography } from '@bambu/react-ui';
import React from 'react';

interface GoalDetailsTransactionHistoryItemProps {
  type: string;
  amount: number;
}

const GoalDetailsTransactionHistoryItem = React.forwardRef(
  function GoalDetailsTransactionHistoryItem(
    { type, amount }: GoalDetailsTransactionHistoryItemProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    return (
      <div ref={ref}>
        <Card>
          <CardContent sx={{ '&&': { py: 1.8, px: 2.5 } }}>
            <Typography variant="body1" fontWeight={500}>
              {formatType(type)} <CurrencyText value={amount} />
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
);

function formatType(str: string): string {
  const transformedStr = str.replace(/([A-Z])/g, ' $1').trim();
  return (
    transformedStr.charAt(0).toUpperCase() +
    transformedStr.slice(1).toLowerCase()
  );
}

export default GoalDetailsTransactionHistoryItem;
