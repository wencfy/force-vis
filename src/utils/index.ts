import React from "react";

export * from './hooks';
export * from './http';
export * from './db';

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

export function getTagStyleFromString(stringInput: string, isDark?: boolean | number): React.CSSProperties {
  let hash = 0;
  for (let i = 0; i < stringInput.length; i++) {
    hash = stringInput.charCodeAt(i) + ((hash << 5) - hash);
  }
  if (!isDark) {
    return {
      color: `hsl(${hash % 360}, 85%, 34%)`,
      background: `hsl(${hash % 360}, 100%, 96%)`,
      borderColor: `hsl(${hash % 360}, 70%, 74%)`
    };
  } else {
    return {
      color: `hsl(${hash % 360}, 54%, 48%)`,
      background: `hsl(${hash % 360}, 32%, 10%)`,
      borderColor: `hsl(${hash % 360}, 54%, 19%)`
    }
  }
}