export function capFirstLetter(inputString: string) {
  const words = inputString?.toLowerCase().split('_') || [];
  const formattedWords = words.map((word, index) =>
    index === 0
      ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      : word
  );
  return formattedWords.join(' ');
}
