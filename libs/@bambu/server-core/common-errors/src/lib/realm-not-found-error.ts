export class RealmNotFoundError extends Error {
  constructor(message?: string) {
    super(message || 'Realm not found.');
  }
}
