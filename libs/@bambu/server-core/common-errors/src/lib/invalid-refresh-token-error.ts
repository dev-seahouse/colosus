export class InvalidRefreshTokenError extends Error {
  constructor(message?: string) {
    super(message || 'Invalid refresh token.');
  }
}
