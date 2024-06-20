export class DcxError extends Error {
  constructor(
    public error: any,
    name: string,
  ) {
    super(error);
    this.name = name;
  }
}

export class DidManagerError extends DcxError {
  constructor(public error: any) {
    super(error, 'DidManagerError');
  }
}

export class DcxServerError extends DcxError {
  constructor(public error: any) {
    super(error, 'DcxServerError');
  }
}

export class DcxDwnError extends DcxError {
  constructor(
    public code: number,
    message: string,
  ) {
    super(`${code} - ${message}`, 'DcxDwnError');
  }
}

export function handleAsyncErrors(target: any, propertyKey: any, descriptor?: any): any {
  if (!descriptor) {
    descriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
  }
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      console.error(`${propertyKey}`, 'Failed', error);
      switch (true) {
        case error instanceof DidManagerError:
          throw new DcxServerError(error);
        case error instanceof DcxServerError:
          throw new DcxServerError(error);
        default:
          throw new DcxError(error, 'DcxError');
      }
    }
  };
  return descriptor;
}

export function handleDwnErrors(target: any, propertyKey: any, descriptor?: any): any {
  if (!descriptor) {
    descriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
  }
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      console.error(`${propertyKey} encountered an error`, error);
      if (error instanceof DcxDwnError) {
        throw error;
      } else {
        throw new DcxDwnError(500, 'An unexpected error occurred');
      }
    }
  };

  return descriptor;
}
