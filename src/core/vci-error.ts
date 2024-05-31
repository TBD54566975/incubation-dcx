export class VciError extends Error {
  constructor(public code: number, message: string) {
    super(`${code}: ${message}`);
    this.name = 'VciError';
  }
}
