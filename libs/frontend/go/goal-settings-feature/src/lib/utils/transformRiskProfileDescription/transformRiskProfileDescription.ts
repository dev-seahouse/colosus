export function transformRiskProfileDescription(description: string) {
  if (description == null) return [];
  const delimiter = '<br/>';
  const result = description.split(delimiter);
  return result;
}
