export class DcxError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'DcxError';
  }
}

export class DcxDidError extends Error {
  constructor(public message: string, did?: string) {
    super(`${did} - ${message}`);
    this.name = 'DcxDidError';
  }
}

export class DcxServerError extends Error {
  constructor(public message: string, error?: any) {
    super(error?.message ?? message);
    this.name = 'DcxServerError';
  }
}

export class DcxDwnError extends Error {
  constructor(public code: number, message: string) {
    super(`${code} - ${message}`);
    this.name = 'DcxDwnError';
  }
}
