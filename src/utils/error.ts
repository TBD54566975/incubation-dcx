export class DcxError extends Error {
  constructor(public error: any, name: string) {
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
  constructor(public code: number, message: string) {
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
      throw new DidManagerError(error);
    }
  };
  return descriptor;
}

