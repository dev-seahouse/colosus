import { List, Typography } from '@bambu/react-ui';

import RiskToleranceSelectionListItem from './RiskToleranceSelectionListItem';

const RISK_TOLERANCE_SELECTION_LIST_ITEMS = [
  {
    primary: 'I want to let my clients choose their own risk profile',
    secondary: 'Good for clients with investing experience',
  },
  {
    primary: 'I want to ask some risk tolerance questions',
    secondary: 'Good for new investors who may not know their risk tolerance',
  },
  {
    primary: (
      <>
        I want to provide both options{' '}
        <Typography
          as="span"
          sx={(theme) => ({
            color: theme.palette.primary.main,
          })}
        >
          (recommended)
        </Typography>
      </>
    ),
  },
];

export const RiskToleranceSelectionList = () => {
  return (
    <List>
      {RISK_TOLERANCE_SELECTION_LIST_ITEMS.map((item, key) => (
        <RiskToleranceSelectionListItem
          primary={item.primary}
          secondary={item.secondary}
          key={key}
        />
      ))}
    </List>
  );
};

export default RiskToleranceSelectionList;
