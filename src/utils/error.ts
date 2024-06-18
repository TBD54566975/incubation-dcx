export class DcxServerError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'DcxServerError';
  }
}

export class DcxDwnError extends Error {
  constructor(public code: number, message: string) {
    super(`${code}: ${message}`);
    this.name = 'DcxDwnError';
  }
}
