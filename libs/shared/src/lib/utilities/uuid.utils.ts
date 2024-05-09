function fnv1aHash(str: string): number {
  let hash = 2166136261; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash *= 16777619; // FNV prime
  }
  return hash >>> 0; // convert to unsigned 32-bit integer
}

export function oneWayHashUuidToInt(uuid: string): number {
  return fnv1aHash(uuid);
}
