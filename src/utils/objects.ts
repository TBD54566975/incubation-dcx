export class Objects implements Object {
  /**
   *
   * Check if an object and its possible child objects (i.e. {}, []) is/are null
   * @param obj The object to check if it is null
   * @returns A boolean indicating if the object is null
   */
  public static isEmptyObject(obj: any): boolean {
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
  public static isEmptyObjectDeep(obj: any): boolean {
    if (obj === null || typeof obj !== 'object') {
      return false;
    }

    if (Array.isArray(obj)) {
      return obj.length === 0;
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (!this.isEmptyObjectDeep(obj[key])) {
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
  public static isArray(obj: any): boolean {
    return Array.isArray(obj);
  }
}
