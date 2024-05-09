// based on the figma colors #00876A (primary) and #62dbb6 (background),
// this function finds the transformation and applies it to the input color
export function transformColorToMatch(inputColor: string): string {
  const originalColor = '#00876A';
  const targetColor = '#62dbb6';
  const originalWithoutHash = originalColor.replace('#', '');
  const targetWithoutHash = targetColor.replace('#', '');
  const originalValue = parseInt(originalWithoutHash, 16);
  const targetValue = parseInt(targetWithoutHash, 16);
  const inputWithoutHash = inputColor.replace('#', '');
  const inputValue = parseInt(inputWithoutHash, 16);
  const originalR = (originalValue >> 16) & 0xff;
  const originalG = (originalValue >> 8) & 0xff;
  const originalB = originalValue & 0xff;
  const targetR = (targetValue >> 16) & 0xff;
  const targetG = (targetValue >> 8) & 0xff;
  const targetB = targetValue & 0xff;
  const inputR = (inputValue >> 16) & 0xff;
  const inputG = (inputValue >> 8) & 0xff;
  const inputB = inputValue & 0xff;
  const transformedR = targetR + (inputR - originalR);
  const transformedG = targetG + (inputG - originalG);
  const transformedB = targetB + (inputB - originalB);
  const clamp = (value: number) => Math.min(255, Math.max(0, value));
  const transformedColor = `#${(
    (clamp(transformedR) << 16) |
    (clamp(transformedG) << 8) |
    clamp(transformedB)
  )
    .toString(16)
    .padStart(6, '0')}`;
  return transformedColor;
}

export default transformColorToMatch;
