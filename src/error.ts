export class DcxError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'DcxError';
  }
}

export class DcxDwnError extends Error {
  constructor(public code: number, message: string) {
    super(`${code}: ${message}`);
    this.name = 'DcxDwnError';
  }
}
