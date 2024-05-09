export function generateLogPrefix(
  functionName: string,
  requestId?: string
): string {
  const logPrefix: string[] = [functionName];

  if (requestId) {
    logPrefix.push(' - ');
    logPrefix.push(requestId);
  }

  logPrefix.push(' -');

  return logPrefix.join('');
}

export function generateLoggingPrefix(
  functionName: string,
  requestId?: string
) {
  return {
    logPrefix: generateLogPrefix(functionName, requestId),
  };
}
