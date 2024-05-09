export function threadSleep(sleepTimeInMs = 1000): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, sleepTimeInMs);
  });
}
