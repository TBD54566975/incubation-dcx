/**
 * Time related utilities.
 */
export class Time {
  /**
   * Sleeps for the desired duration
   * @param durationInMillisecond the desired amount of sleep time
   * @returns when the provided duration has passed
   */
  public static async sleep(durationInMillisecond: number = 5000): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, durationInMillisecond));
  }

  /**
   * Retries fn() after sleep  for the desired duration if retries > 0
   * @param fn the function to retry
   * @param retries the number of retries
   * @param retryIntervalMs the duration to sleep between retries
   * @throws error if retries <= 0
   * @returns the result of fn()
   */
  public static async retry<T>(
    fn: () => Promise<T> | T,
    { retries, retryIntervalMs }: { retries: number; retryIntervalMs: number },
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) {
        throw error;
      }
      await Time.sleep(retryIntervalMs);
      return this.retry(fn, { retries: retries - 1, retryIntervalMs });
    }
  }
}
