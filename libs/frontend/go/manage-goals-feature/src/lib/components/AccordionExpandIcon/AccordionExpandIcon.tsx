import React from 'react';
import type { IconButtonProps } from '@bambu/react-ui';
import { styled, IconButton } from '@bambu/react-ui';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
interface AccordionExpandIconProps extends IconButtonProps {
  expand: boolean;
}

// used for accordions , shows on the left, arrow button turns 180 degrees when expanded
const AccordionExpandIcon = styled((props: AccordionExpandIconProps) => {
  const {
    expand,
    children = <ExpandMoreIcon color="primary" />,
    ...other
  } = props;
  return <IconButton children={children} {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default AccordionExpandIcon;
