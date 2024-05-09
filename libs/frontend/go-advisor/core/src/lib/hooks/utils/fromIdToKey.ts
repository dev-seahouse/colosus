export function fromIdToKey<T extends { id?: string | null; key: string }>(
  acc: Record<string, string>,
  curr: T
) {
  // this is because IConnectPortfolioSummaryDto.id is optional and nullable
  if (curr.id == null) {
    throw new Error('id should not be null or undefined');
  }
  acc[curr.id] = curr.key;
  return acc as Record<string, string>;
}
