import { URLBuilder, URLBuilderProps } from './URLBuilder';

describe('URLBuilder', () => {
  const baseProps: URLBuilderProps = {
    url: 'http://test.com',
    params: {
      foo: 'bar',
      baz: 'qux',
    },
    hashParams: {
      fooHash: 'barHash',
      bazHash: 'quxHash',
    },
  };

  it('should be defined', () => {
    expect(URLBuilder).toBeDefined();
  });

  it('should construct correctly', () => {
    const urlBuilder = new URLBuilder(baseProps);
    expect(urlBuilder).toBeInstanceOf(URLBuilder);
  });

  it('should output correct string', () => {
    const urlBuilder = new URLBuilder(baseProps);
    const urlString = urlBuilder.toString();
    expect(urlString).toEqual(
      'http://test.com?baz=qux&foo=bar#bazHash=quxHash&fooHash=barHash'
    );
  });

  it('should handle URL with existing params and hashParams', () => {
    const propsWithExistingParams: URLBuilderProps = {
      ...baseProps,
      url: 'http://test.com?existingParam=existVal#existingHash=existHashVal',
    };
    const urlBuilder = new URLBuilder(propsWithExistingParams);
    const urlString = urlBuilder.toString();
    expect(urlString).toEqual(
      'http://test.com?baz=qux&existingParam=existVal&foo=bar#bazHash=quxHash&existingHash=existHashVal&fooHash=barHash'
    );
  });

  it('should handle undefined params and hashParams', () => {
    const urlBuilder = new URLBuilder({ url: baseProps.url });
    const urlString = urlBuilder.toString();
    expect(urlString).toEqual(baseProps.url);
  });

  it('should handle boolean, zero, and empty string params and hashParams', () => {
    const urlBuilder = new URLBuilder({
      url: `${baseProps.url}`,
      params: {
        string1: '',
        string2: ' ',
        boolean1: true,
        boolean2: false,
        number1: 0,
        number2: 1,
      },
      hashParams: {
        string1: '',
        string2: ' ',
        boolean1: true,
        boolean2: false,
        number1: 0,
        number2: 1,
      },
    });
    const urlString = urlBuilder.toString();
    expect(urlString).toEqual(
      'http://test.com?boolean1=true&boolean2=false&number1=0&number2=1&string1=&string2=%20#boolean1=true&boolean2=false&number1=0&number2=1&string1=&string2=%20'
    );
  });

  it('should handle URLs with special characters', () => {
    const props: URLBuilderProps = {
      url: 'http://test.com',
      params: {
        foo: 'bar with spaces',
      },
    };
    const urlBuilder = new URLBuilder(props);
    expect(urlBuilder.toString()).toEqual(
      'http://test.com?foo=bar%20with%20spaces'
    );
  });

  it('should handle URLs without a protocol', () => {
    const props: URLBuilderProps = {
      url: 'test.com',
      params: {
        foo: 'bar',
      },
    };
    const urlBuilder = new URLBuilder(props);
    expect(urlBuilder.toString()).toEqual('test.com?foo=bar');
  });

  it('should handle empty strings for params', () => {
    const props: URLBuilderProps = {
      url: 'http://test.com',
      params: {
        foo: '',
      },
    };
    const urlBuilder = new URLBuilder(props);
    expect(urlBuilder.toString()).toEqual('http://test.com?foo=');
  });

  it('should handle numeric values for params', () => {
    const props: URLBuilderProps = {
      url: 'http://test.com',
      params: {
        foo: 123,
      },
    };
    const urlBuilder = new URLBuilder(props);
    expect(urlBuilder.toString()).toEqual('http://test.com?foo=123');
  });

  it('should handle boolean values for params', () => {
    const props: URLBuilderProps = {
      url: 'http://test.com',
      params: {
        foo: true,
      },
    };
    const urlBuilder = new URLBuilder(props);
    expect(urlBuilder.toString()).toEqual('http://test.com?foo=true');
  });

  it('should handle complex URL paths', () => {
    const props: URLBuilderProps = {
      url: 'http://test.com/path/to/resource',
      params: {
        foo: 'bar',
      },
    };
    const urlBuilder = new URLBuilder(props);
    expect(urlBuilder.toString()).toEqual(
      'http://test.com/path/to/resource?foo=bar'
    );
  });

  it('should correctly add a parameter', () => {
    const urlBuilder = new URLBuilder({ url: 'http://example.com' });
    urlBuilder.addParam('param1', 'value1');
    expect(urlBuilder.toString()).toBe('http://example.com?param1=value1');
  });

  it('should correctly remove a parameter', () => {
    const urlBuilder = new URLBuilder({
      url: 'http://example.com',
      params: { param1: 'value1', param2: 'value2' },
    });
    urlBuilder.removeParam('param1');
    expect(urlBuilder.toString()).toBe('http://example.com?param2=value2');
  });

  it('should correctly add a hash parameter', () => {
    const urlBuilder = new URLBuilder({ url: 'http://example.com' });
    urlBuilder.addHashParam('hash1', 'value1');
    expect(urlBuilder.toString()).toBe('http://example.com#hash1=value1');
  });

  it('should correctly remove a hash parameter', () => {
    const urlBuilder = new URLBuilder({
      url: 'http://example.com',
      hashParams: { hash1: 'value1', hash2: 'value2' },
    });
    urlBuilder.removeHashParam('hash1');
    expect(urlBuilder.toString()).toBe('http://example.com#hash2=value2');
  });

  it('should not change the URL when removing a non-existent parameter', () => {
    const urlBuilder = new URLBuilder({
      url: 'http://example.com',
      params: { param1: 'value1' },
    });
    urlBuilder.removeParam('param2');
    expect(urlBuilder.toString()).toBe('http://example.com?param1=value1');
  });

  it('should not change the URL when removing a non-existent hash parameter', () => {
    const urlBuilder = new URLBuilder({
      url: 'http://example.com',
      hashParams: { hash1: 'value1' },
    });
    urlBuilder.removeHashParam('hash2');
    expect(urlBuilder.toString()).toBe('http://example.com#hash1=value1');
  });

  it('should overwrite an existing parameter when adding a parameter with the same name', () => {
    const urlBuilder = new URLBuilder({
      url: 'http://example.com',
      params: { param1: 'value1' },
    });
    urlBuilder.addParam('param1', 'newvalue');
    expect(urlBuilder.toString()).toBe('http://example.com?param1=newvalue');
  });

  it('should overwrite an existing hash parameter when adding a hash parameter with the same name', () => {
    const urlBuilder = new URLBuilder({
      url: 'http://example.com',
      hashParams: { hash1: 'value1' },
    });
    urlBuilder.addHashParam('hash1', 'newvalue');
    expect(urlBuilder.toString()).toBe('http://example.com#hash1=newvalue');
  });
});
