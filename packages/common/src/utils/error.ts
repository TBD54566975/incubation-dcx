export const dwn500Error = {
  code   : 500,
  detail : 'DWN server error',
};
export class DcxError extends Error {
  constructor(error: any, name: string = 'DcxError') {
    super(error);
    this.name = name;
  }
}

export class DidDhtManagerError extends DcxError {
  constructor(error: any) {
    super( 'DidDhtManagerError', error);
  }
}

export class DcxServerError extends DcxError {
  constructor(error: any) {
    super( 'DcxServerError', error);
  }
}

export class DcxIssuerError extends DcxError {
  constructor(error: any) {
    super( 'DcxIssuerError', error);
  }
}

export class DcxApplicantError extends DcxError {
  constructor(error: any) {
    super( 'DcxApplicantError', error);
  }
}

export class DcxDwnError extends DcxError {
  constructor(error: any) {
    super( 'DcxDwnError', error);
  }
}

export class DcxProtocolHandlerError extends DcxError {
  constructor(error: any) {
    super( 'DcxProtocolHandlerError', error);
  }
}

export class DwnError extends Error {
  constructor(code: number, message: string) {
    super(`${code} - ${message}`);
    this.name = 'DwnError';
  }
}
// Decorators; Unused due to lack of node.js support
export function handleDcxErrors(target: any, propertyKey: any, descriptor?: any): any {
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
        case error instanceof DidDhtManagerError:
          throw new DidDhtManagerError(error);
        case error instanceof DcxServerError:
          throw new DcxServerError(error);
        case error instanceof DcxDwnError:
          throw new DcxDwnError(error);
        default:
          throw new DcxError(error);
      }
    }
  };
  return descriptor;
}

export function handleDcxDwnErrors(target: any, propertyKey: any, descriptor?: any): any {
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
        throw new DcxDwnError(error);
      }
    }
  };

  return descriptor;
}
