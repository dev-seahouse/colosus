import { ListItem, ListItemButton, Radio, Stack } from '@bambu/react-ui';
import { ReactNode } from 'react';

export interface InvestmentStyleListItemProps {
  // title component, use Typography to style/format title
  title: ReactNode;
  // can be any node or a function that takes a boolean indicating if the item is selected
  description?: ReactNode | ((selected: boolean) => ReactNode);
  selected?: boolean;
  id?: string;
  onSelect?: (id?: string) => void;
  capitalize?: boolean;
}

/**
 *  InvestmentStyleListItem
 *  formatting of title and description is up to the consumer
 *  do not change this component to include styling
 */
export const InvestmentStyleListItem = ({
  title = 'Title',
  description,
  selected = false,
  id,
  onSelect,
  capitalize = true,
}: InvestmentStyleListItemProps) => {
  const onClick = () => {
    onSelect?.(id);
  };

  return (
    <ListItem>
      <ListItemButton
        onClick={onClick}
        selected={selected}
        role="button"
        aria-label={`select ${title}`}
      >
        <Stack
          sx={{
            flexGrow: 1,
            ...(capitalize && { textTransform: 'capitalize' }),
            paddingRight: [0, 2, 3],
          }}
        >
          {title}
          {typeof description === 'function'
            ? description(selected)
            : description}
        </Stack>
        <Radio
          checked={selected}
          size="small"
          disableRipple
          sx={{ position: 'relative', right: '-15px', pl: '15px' }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default InvestmentStyleListItem;
