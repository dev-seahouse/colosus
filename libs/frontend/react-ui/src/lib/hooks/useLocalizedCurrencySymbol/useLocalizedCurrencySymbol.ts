import { useSyncExternalStore } from 'react';

declare const Localize: any;

export function useLocalizedCurrencySymbol() {
  try {
    const language = useSyncExternalStore((callback) => {
      isDefined(Localize) && Localize.on('setLanguage', callback);
      return () => {
        isDefined(Localize) && Localize.off('setLanguage', callback);
      };
    }, getSnapShot);
    if (language === 'en-GB') return '£';
    return '$';
  } catch (error) {
    return '$';
  }
}

function getSnapShot() {
  return isDefined(Localize) && Localize.getLanguage();
}

export default useLocalizedCurrencySymbol;

function isDefined(variable: any) {
  return typeof variable !== 'undefined';
}
