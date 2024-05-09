import { SvgIcon } from '@bambu/react-ui';
import type { SvgIconProps } from '@bambu/react-ui';

export type AmpStoriesIconProps = SvgIconProps;

export function AmpStoriesIcon(props: AmpStoriesIconProps) {
  return (
    <SvgIcon {...props}>
      <g clipPath="url(#clip0_1397_4132)">
        <path d="M17 4H7V19H17V4Z" />
        <path d="M5 6H3V17H5V6Z" />
        <path d="M21 6H19V17H21V6Z" />
      </g>
      <defs>
        <clipPath id="clip0_1397_4132">
          <rect width="24" height="24" />
        </clipPath>
      </defs>
    </SvgIcon>
  );
}

export default AmpStoriesIcon;
