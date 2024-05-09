import { URLBuilder, URLBuilderProps } from './URLBuilder';

/**
 * createURL is a helper function that takes an object of type URLBuilderProps
 * and creates a formatted URL string based on the provided parameters.
 *
 * The function parses the input and returns the URL string.
 *
 * @param props - An object containing the base URL and optional query and hash parameters.
 * @returns A string representing the formatted URL.
 *
 * @example
 *  createURL({
 *    url: 'http://example.com',
 *    params: { param1: 'value1', param2: 'value2' },
 *    hashParams: { hash1: 'value3', hash2: 'value4' }
 *  });
 *  // Returns: 'http://example.com?param1=value1&param2=value2#hash1=value3&hash2=value4'
 *
 * @example
 *  createURL({ url: 'http://example.com' });
 *  // Returns: 'http://example.com'
 */
export function createURL(props: URLBuilderProps) {
  return new URLBuilder(props).toString();
}
