export function transformKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(transformKeys);
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (value instanceof Date) {
        newObj[key.startsWith('__') ? key.slice(2, key.length - 2) : key] =
          value;
        continue;
      }
      const newKey = key.startsWith('__') ? key.slice(2, key.length - 2) : key;
      newObj[newKey] = transformKeys(value);
    }
    return newObj;
  }
  return obj;
}

export function transformArrObj<T>(arr: T[]): T[] {
  return arr.map((item) => {
    if (typeof item === 'object' && item !== null) {
      return transformKeys(item);
    }
    return item;
  });
}
