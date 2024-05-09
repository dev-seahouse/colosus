export function getDomainFromHost(host: string): string {
  const stripSchemaRegex = /http(s)?:\/\//;
  const portRegex = /:\d+$/;
  const ipAddressRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

  // Remove the port (if present)
  host = host
    .replace(portRegex, '')
    // Remove the schema (if present)
    .replace(stripSchemaRegex, '');

  if (ipAddressRegex.test(host)) {
    return host; // IP address doesn't have a domain
  }

  const parts = host.split('.'); // Split the host by "." to get the parts

  // Remove all subdomains (if present)
  while (parts.length > 2) {
    parts.shift();
  }

  // Remove the port (if present)
  parts[parts.length - 1] = parts[parts.length - 1].split(':').shift() || '';

  // Rejoin the parts to get the modified host
  return parts.join('.');
}
