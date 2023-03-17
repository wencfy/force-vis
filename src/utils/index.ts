export * from './hooks';
export * from './http';

export function deepClone<T>(obj: T): T {
  if (typeof obj !== 'object') {
    return obj;
  }
  let newObj: T = (obj instanceof Array ? [] : {}) as T;
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      newObj[key] = deepClone(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}