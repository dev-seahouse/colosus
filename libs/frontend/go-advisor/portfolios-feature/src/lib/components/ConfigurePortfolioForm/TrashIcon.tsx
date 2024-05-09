import type { SvgIconProps } from '@bambu/react-ui';
import { SvgIcon } from '@bambu/react-ui';

export function TrashIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 3V4H20V6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4V4H9V3H15ZM7 19H17V6H7V19ZM9 8H11V17H9V8ZM15 8H13V17H15V8Z"
        fill="#00876A"
      />
    </SvgIcon>
  );
}

export default TrashIcon;
