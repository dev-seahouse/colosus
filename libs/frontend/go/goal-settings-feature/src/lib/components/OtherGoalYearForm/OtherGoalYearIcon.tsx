import { SvgIcon } from '@bambu/react-ui';
import type { SvgIconProps } from '@bambu/react-ui';

export type OtherGoalYearIconProps = SvgIconProps;

export function OtherGoalYearIcon(props: OtherGoalYearIconProps) {
  return (
    <SvgIcon viewBox="0 0 44 44" {...props}>
      <g clipPath="url(#clip0_1417_59081)">
        <path d="M20.1667 14.6667V23.8333L27.9583 28.4533L29.37 26.1067L22.9167 22.275V14.6667H20.1667ZM38.5 18.3333V5.5L33.66 10.34C30.69 7.35167 26.565 5.5 22 5.5C12.8883 5.5 5.5 12.8883 5.5 22C5.5 31.1117 12.8883 38.5 22 38.5C31.1117 38.5 38.5 31.1117 38.5 22H34.8333C34.8333 29.0767 29.0767 34.8333 22 34.8333C14.9233 34.8333 9.16667 29.0767 9.16667 22C9.16667 14.9233 14.9233 9.16667 22 9.16667C25.5383 9.16667 28.7467 10.615 31.075 12.925L25.6667 18.3333H38.5Z" />
      </g>
      <defs>
        <clipPath id="clip0_1417_59081">
          <rect width="44" height="44" fill="white" />
        </clipPath>
      </defs>
    </SvgIcon>
  );
}

export default OtherGoalYearIcon;
