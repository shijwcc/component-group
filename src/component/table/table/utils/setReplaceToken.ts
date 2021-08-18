import { forEachDeep } from '@ali-i18n-fe/intl-util/lib/pure-functions/forEachDeep';
import Tools from '../../../../utils/tool';

type IObject = Record<string, any>;
export function setReplaceToken<T extends IObject>(
  dataSource: T,
  options: { template: IObject; setValue: string | IObject },
): T {
  const { template, setValue } = options;
  const defaultKey = 'value';
  const values: IObject = {};

  values[defaultKey] = setValue;

  const pathMap = getSetPath(template);
  const EmptySymbol = Symbol('record_empty');
  Object.entries(pathMap).forEach(([path, recordKey]) => {
    const value = Tools.get(values, path, EmptySymbol);

    if (value !== EmptySymbol) {
      Tools.set(dataSource, recordKey, value);
    }
  });

  return dataSource;
}

/**
 * 获取Template对应值的字段
 * @param template
 * @returns {IObject}
 */
export function getSetPath(template: IObject): Record<string, string> {
  const tokenKeyReg = /^\${(.+)?}$/;
  const pathMap: IObject = {};

  forEachDeep(template, (object, objectPath) => {
    Object.entries(object).forEach(([key, item]) => {
      if (typeof item === 'string' && tokenKeyReg.test(item)) {
        const reg = new RegExp(tokenKeyReg);
        const [, matchKey] = reg.exec(item);
        pathMap[`${objectPath}${objectPath ? '.' : ''}${key}`] = matchKey;
      }
    });
  });

  return pathMap;
}
