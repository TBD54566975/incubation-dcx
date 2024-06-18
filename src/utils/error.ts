export class DcxServerError extends Error {
  constructor(public message: string, error?: any) {
    super(error?.message ?? message);
    this.name = 'DcxServerError';
  }
}

export class DcxDwnError extends Error {
  constructor(public code: number, message: string) {
    super(`${code}: ${message}`);
    this.name = 'DcxDwnError';
  }
}
