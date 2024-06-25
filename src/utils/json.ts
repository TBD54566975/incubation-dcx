type JSONStringifyOptions = {
  space?: string | number;
  replacer?: (this: any, key: string, value: any) => any;
};

export const stringifier = (obj: any, options: JSONStringifyOptions = { space: 2 }) =>
  JSON.stringify(obj, options.replacer, options.space);

export const parse = (strObj: string) => JSON.parse(strObj);
