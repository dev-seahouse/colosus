import type { ReactNode, CSSProperties } from 'react';
import { IconButton, MuiTooltip } from '../../index';
import type { TooltipProps as MuiTooltipProps } from '../../index';

export interface TooltipProps
  extends Omit<MuiTooltipProps, 'children' | 'title'> {
  icon: ReactNode;
  title?: string;
  fontSize?: CSSProperties['fontSize'];
}

export function Tooltip({
  title = '',
  icon,
  fontSize = '1rem',
  ...props
}: TooltipProps) {
  return (
    <MuiTooltip title={title} {...props} leaveDelay={200}>
      <IconButton
        sx={{
          padding: '3px',
          verticalAlign: 'sub',
          '& svg': { fontSize: fontSize },
        }}
      >
        {icon}
      </IconButton>
    </MuiTooltip>
  );
}
export default Tooltip;
