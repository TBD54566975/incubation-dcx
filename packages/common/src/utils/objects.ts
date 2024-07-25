export class Objects {
  /**
   *
   * Check if an object and its possible child objects (i.e. {}, []) is/are null
   * @param obj The object to check if it is null
   * @returns A boolean indicating if the object is null
   */
  public static isEmpty(obj: any): boolean {
    if (obj === null || typeof obj !== 'object') {
      return false;
    }

    if (Array.isArray(obj)) {
      return obj.length === 0;
    }

    return Object.keys(obj).length === 0;
  }

  /**
   *
   * Check if an object and its possible child objects (i.e. {}, []) is/are null
   * @param obj The object to check if it is null
   * @returns A boolean indicating if the object is null
   */
  public static isEmptyDeep(obj: any): boolean {
    if (obj === null || typeof obj !== 'object') {
      return false;
    }

    if (Array.isArray(obj)) {
      return obj.length === 0;
    }

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (!this.isEmptyDeep(obj[key])) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   *
   * Check if an object is an array
   * @param obj The object to check if it is an array
   * @returns A boolean indicating if the object is an array
   */
  public static isArray(arr: any): boolean {
    return Array.isArray(arr);
  }

  /**
   *
   * Check if an object is an empty array
   *
   * @param obj The object to check if it is an empty array
   * @returns A boolean indicating if the object is an empty array
   */
  public static isEmptyArray(arr: any): boolean {
    return !arr || arr.length === 0;
  }
}
