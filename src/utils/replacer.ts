import get from 'lodash/get';
import { mapDeep } from '@ali-i18n-fe/intl-util/lib/pure-functions/forEachDeep';

export function replaceStr(target: string, vars: any): any {
  const needToParse = /^\$\${([^}]+)}$/.test(target); // string to other type
  const reg = new RegExp('\\${([^}]+)}', 'g');

  const replaceOneReg = (value: string): string => {
    try {
      if (/^[^()=!<>+]+$/.test(value)) {
        const notFound = Symbol('not found');
        const result = get(vars, value, notFound);
        if (result !== notFound) {
          return result;
        }
      }

      const fn = new Function(...Object.keys(vars), `return ${value}`);
      return fn(...Object.values(vars));
    } catch (e) {
      return '';
    }
  };

  // if there is only one replace token , replace result may not be string
  const replaceJustOneToParse = () => {
    const result = reg.exec(target);
    return replaceOneReg(result ? result[1] : '');
  };

  return needToParse
    ? replaceJustOneToParse()
    : target.replace(reg, ($value, value) => {
        return replaceOneReg(value);
      });
}

export default function createReplacer(ctxes): <T>(target: T) => T {
  return (target: any) => {
    if (target instanceof Object) {
      return mapDeep(
        target,
        obj => {
          Object.keys(obj).forEach(key => {
            const value = obj[key];
            obj[key] = typeof value === 'string' ? replaceStr(value, ctxes) : value;
          });

          return obj;
        },
        { isIncludeArray: true },
      );
    } else if (typeof target === 'string') {
      return replaceStr(target, ctxes);
    }

    return target;
  };
}
