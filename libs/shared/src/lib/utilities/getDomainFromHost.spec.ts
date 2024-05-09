import { getDomainFromHost as sut } from './getDomainFromHost';

describe('getDomainFromHost', () => {
  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return the domain name from the host string', () => {
    expect(sut('subdomain.example.com:8080')).toBe('example.com');
    expect(sut('localhost:8080')).toBe('localhost');
    expect(sut('app.test.go-bambu.co:8080')).toBe('go-bambu.co');
    expect(sut('app.test.go-bambu.co')).toBe('go-bambu.co');
  });
});
