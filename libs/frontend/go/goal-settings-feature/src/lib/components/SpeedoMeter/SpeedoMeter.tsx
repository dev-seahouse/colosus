const STEP_DEGREE = 38.5; // each step is x degrees clock wise, adjusted to the svg
export const LEVELS = [1, 2, 3, 4, 5] as const;
const STEPS = Object.fromEntries(LEVELS.map((i) => [i, (i - 1) * STEP_DEGREE]));
export interface SpeedoMeterProps {
  // the level of the speed meter, 1-5
  level?: Extract<(typeof LEVELS)[number], number>;
  // width of the svg container, not the speedmeter itself, without default svg can't center
  width?: number;
  // height of the svg container, not the speedmeter itself, without default svg can't center
  height?: number;
}

export function SpeedoMeter({
  level = 1,
  width = 229,
  height = 114,
}: SpeedoMeterProps) {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M.5 114a114 114 0 0 1 15.476-57.35l51.322 29.874A54.616 54.616 0 0 0 59.884 114H.5Z"
        fill="#F39D91"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M147.372 4.842a113.999 113.999 0 0 0-67.559.563l18.069 56.568a54.617 54.617 0 0 1 32.367-.27l17.123-56.86ZM21.91 47.494a114 114 0 0 1 53.904-40.73l20.152 55.86a54.616 54.616 0 0 0-25.825 19.514L21.91 47.494ZM.5 114a114 114 0 0 1 20.02-64.527l48.955 33.613A54.617 54.617 0 0 0 59.884 114H.5ZM151.298 6.102a113.998 113.998 0 0 1 54.611 39.778l-47.616 35.484a54.615 54.615 0 0 0-26.163-19.057l19.168-56.205Zm77.196 106.746a114.004 114.004 0 0 0-20.671-64.322L159.21 82.632a54.611 54.611 0 0 1 9.903 30.816l59.381-.6Z"
        fill="url(#a)"
      />
      <path
        d="m55.667 94.899 61.982 5.796c2.409.696 4.94 2.972 3.988 7.545-.953 4.573-4.296 6.198-6.824 6.071L54.657 99.75c-1.207-.292-1.937-1.51-1.67-2.788.265-1.278 1.437-2.18 2.68-2.063Z"
        fill="#40596B"
        transform-origin="116 109"
      >
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0"
          to={STEPS[level.toString(10)]}
          dur="0.2s"
          fill="freeze"
        />
      </path>
      <animateTransform
        attributeName="transform"
        dur="3s"
        type="rotate"
        from="0"
        to="116 109"
      />
      <defs>
        <linearGradient
          id="a"
          x1="190"
          y1="105.5"
          x2="40"
          y2="105.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F67773" />
          <stop offset=".525" stopColor="#F9D728" />
          <stop offset="1" stopColor="#7BF796" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default SpeedoMeter;
