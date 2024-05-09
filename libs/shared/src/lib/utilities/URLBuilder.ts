export type URLBuilderProps = {
  /**
   * The base URL string.
   */
  url: string;
  /**
   * An object where each key-value pair represents a query parameter
   * to be appended to the URL. The key is the parameter name, and the value
   * is the parameter value. The function encodes the parameters as a part of
   * the query string of the URL.
   */
  params?: Record<string, any>;
  /**
   * An object where each key-value pair represents a hash parameter
   * to be appended to the URL. The key is the hash parameter name, and
   * the value is the hash parameter value. The function encodes the
   * hash parameters as a part of the fragment identifier of the URL.
   */
  hashParams?: Record<string, any>;
};

/**
 * URLBuilder is a class used to construct and format URLs based on provided parameters.
 *
 * The class takes a URLBuilderProps object in its constructor
 */
export class URLBuilder {
  private readonly url: string;
  private readonly params: Record<string, any>;
  private readonly hashParams: Record<string, any>;

  /**
   * Constructs a new instance of URLBuilder.
   *
   * @param props - An object containing the base URL and optional query and hash parameters.
   */
  constructor(props: URLBuilderProps) {
    const { url, params, hashParams } = props;
    const [baseUrl, queryString, hashString] = url.split(/[\\?#]/);

    this.url = baseUrl;
    this.params = { ...this.parseQueryOrHash(queryString), ...params };
    this.hashParams = { ...this.parseQueryOrHash(hashString), ...hashParams };
  }

  /**
   * Private helper method that parses a string of query or hash parameters.
   *
   * @param queryOrHashString - A string of URL-encoded query or hash parameters.
   * @returns An object with each key-value pair decoded from the input string.
   */
  private parseQueryOrHash(queryOrHashString: string): Record<string, any> {
    const result: Record<string, any> = {};
    if (queryOrHashString) {
      queryOrHashString.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        result[key] = decodeURIComponent(value);
      });
    }
    return result;
  }

  /**
   * Private helper method that processes an object of query or hash parameters into
   * a string that can be appended to a URL.
   *
   * @param params - An object where each key-value pair represents a query or hash parameter.
   * @returns A URL-encoded string of the input parameters.
   */
  private processParams(params: Record<string, any>) {
    return Object.keys(params)
      .filter((key) => params[key] != null) // Note we are not using !== because we are testing for both null and undefined
      .sort() // Sorting of the keys, while not required ensures replicability in the tests
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
  }

  /**
   * Adds or updates a parameter to the URL.
   *
   * @param key - The name of the parameter.
   * @param value - The value of the parameter.
   * @returns The URLBuilder instance (to allow method chaining).
   */
  addParam(key: string, value: any): URLBuilder {
    this.params[key] = value;
    return this;
  }

  /**
   * Removes a parameter from the URL.
   *
   * @param key - The name of the parameter to remove.
   * @returns The URLBuilder instance (to allow method chaining).
   */
  removeParam(key: string): URLBuilder {
    delete this.params[key];
    return this;
  }

  /**
   * Adds or updates a hash parameter to the URL.
   *
   * @param key - The name of the hash parameter.
   * @param value - The value of the hash parameter.
   * @returns The URLBuilder instance (to allow method chaining).
   */
  addHashParam(key: string, value: any): URLBuilder {
    this.hashParams[key] = value;
    return this;
  }

  /**
   * Removes a hash parameter from the URL.
   *
   * @param key - The name of the hash parameter to remove.
   * @returns The URLBuilder instance (to allow method chaining).
   */
  removeHashParam(key: string): URLBuilder {
    delete this.hashParams[key];
    return this;
  }

  /**
   * Converts the URLBuilder instance into a string that represents the full URL
   * with all provided parameters and hash parameters.
   *
   * @returns A string representing the formatted URL.
   */
  toString() {
    const params = this.processParams(this.params);
    const hashParams = this.processParams(this.hashParams);
    return (
      this.url +
      (params ? (this.url.indexOf('?') ? '?' : '&') + params : '') +
      (hashParams ? (this.url.indexOf('#') ? '#' : '&') + hashParams : '')
    );
  }
}
