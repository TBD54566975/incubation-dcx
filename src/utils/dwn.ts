export class DwnUtils {
  public static is2xx = (code: number) => code >= 200 && code <= 299;
  public static is3xx = (code: number) => code >= 300 && code <= 399;

  public static isSuccess = (code: number) => this.is2xx(code) || this.is3xx(code);
  public static isFailure = (code: number) => !this.isSuccess(code);
}
