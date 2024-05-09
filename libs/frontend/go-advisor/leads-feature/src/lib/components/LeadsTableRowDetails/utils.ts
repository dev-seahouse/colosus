export function byKey(key: string) {
  return (field: { key: string }) => field.key === key;
}

export function toTitleCase(word: string) {
  return word.toUpperCase().charAt(0) + word.toLowerCase().slice(1);
}
