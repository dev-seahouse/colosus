export function pluralize(number: number, unit: string): string {
  if (number === 1) {
    return `${number} ${unit}`;
  } else {
    if (
      unit.endsWith('s') ||
      unit.endsWith('ss') ||
      unit.endsWith('sh') ||
      unit.endsWith('ch') ||
      unit.endsWith('x') ||
      unit.endsWith('z')
    ) {
      return `${number} ${unit}es`;
    } else if (unit.endsWith('y') && !isVowel(unit[unit.length - 2])) {
      return `${number} ${unit.slice(0, -1)}ies`;
    } else if (unit.endsWith('o') && !isException(unit)) {
      return `${number} ${unit}es`;
    } else if (unit.endsWith('f') || unit.endsWith('fe')) {
      if (unit.endsWith('f')) {
        return `${number} ${unit.slice(0, -1)}ves`;
      } else {
        return `${number} ${unit.slice(0, -2)}ves`;
      }
    } else if (unit.endsWith('us')) {
      return `${number} ${unit.slice(0, -2)}i`;
    } else if (unit.endsWith('is')) {
      return `${number} ${unit.slice(0, -2)}es`;
    } else if (unit.endsWith('on')) {
      return `${number} ${unit.slice(0, -2)}a`;
    } else {
      return `${number} ${unit}s`;
    }
  }
}

function isVowel(letter: string): boolean {
  return ['a', 'e', 'i', 'o', 'u'].includes(letter.toLowerCase());
}

function isException(unit: string): boolean {
  const exceptions = ['photo', 'piano', 'halo'];
  return exceptions.includes(unit.toLowerCase());
}
