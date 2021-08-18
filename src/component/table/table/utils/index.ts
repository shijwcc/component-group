import { TypeElement } from '../../../../interface';
import { mapDeep } from '@ali-i18n-fe/intl-util/lib/pure-functions/forEachDeep';
import { replaceTokenWithExpress, replaceToken } from '@ali-i18n-fe/intl-util/lib/pure-functions/replace-variable';

export function dataListReplaceObjectToken(dataItem: Record<string, any>, index: number, elements: TypeElement) {
  const object = Object.assign({}, dataItem, { record: dataItem, rowIndex: index });
  if (!object) {
    return object;
  }

  return mapDeep(
    elements,
    (obj, path) => {
      const newObject = {};

      const isAction = /(^actions?|\.actions?)\.?/.test(path);
      const isTemplate = /(^templates?|\.templates?)\.?/.test(path);
      const replaceContext = isAction || isTemplate ? replaceTokenWithExpress(object) : replaceToken(object);

      if (Array.isArray(obj)) {
        return obj.map((value) => {
          if (typeof value === 'string' || typeof value === 'number') {
            return replaceContext(value);
          } else {
            return value;
          }
        });
      }

      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          newObject[key] = replaceContext(value);
        } else {
          newObject[key] = value;
        }
      });

      return newObject;
    },
    { isIncludeArray: true },
  );
}
