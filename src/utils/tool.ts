import { BOOLEAN, OBJECT, STRING, UNDEFINED } from '../constants';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import pickBy from 'lodash/pickBy';
import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';

/**
 * 获取medusa多语言key, 兼容多系统key差异
 */
const localeMap = {
  en: 'en-us',
  en_US: 'en-us',

  zh: 'zh-cn',
  zh_CN: 'zh-cn',

  th: 'th-th',
  th_TH: 'th-th',

  vi: 'vi-vn',
  vi_VN: 'vi-vn',

  id: 'in-id',
  in_ID: 'in-id',

  // ms: 'ms-my',
  // ms_MY: 'ms-my',

  // tl: 'tl-ph',
  // tl_PH: 'tl-ph',

  ms: 'en-us',
  ms_MY: 'en-us',

  tl: 'en-us',
  tl_PH: 'en-us',
};

const Tools = {
  get,
  set,
  pickBy,
  isEmpty,
  pick,
  addQueryString(name, value, url = location.href) {
    const pattern = `${name}=([^&]*)`;
    const replaceText = `${name}=${value}`;
    if (url.match(pattern)) {
      let tmp = `/(${name}=)([^&]*)/gi`;
      tmp = url.replace(eval(tmp), replaceText);
      return tmp;
    } else {
      if (url.match('[?]')) {
        return `${url}&${replaceText}`;
      } else {
        return `${url}?${replaceText}`;
      }
    }
  },
  /**
   * 判断数组
   * @param {*} value
   */
  isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  },
  /**
   * 数组深拷贝
   * @param {*} value
   */
  copyArray(value: any[] = []): any[] {
    return value.slice(0);
  },
  /**
   * 对象深拷贝
   * @param {*} value
   */
  copyObject(value) {
    return cloneDeep(value);
  },
  /**
   * 判断对象
   * @param {*} value
   */
  isObject(value) {
    return Object.prototype.toString.call(value) === OBJECT;
  },
  /**
   * 判断布尔
   * @param {*} value
   */
  isBoolean(value) {
    return Object.prototype.toString.call(value) === BOOLEAN;
  },
  /**
   * 判断undefined
   * @param {*} value
   */
  isUndefined(value) {
    return Object.prototype.toString.call(value) === UNDEFINED;
  },
  /**
   * 判断字符串
   * @param {*} value
   */
  isString(value) {
    return Object.prototype.toString.call(value) === STRING;
  },
  /**
   * 获取多种数据格式情况下，最底层的value
   * @param {*} data
   */
  getValue(data) {
    return Tools.isObject(data) ? data.value : data;
  },
  /**
   * 获取多种数据格式情况下，最底层的label
   * @param {*} data
   */
  getLabel(data) {
    return data ? (Tools.isObject(data) ? data.label : data) : '';
  },
  /**
   * 获取对象的 key
   * @param {*} value
   */
  getObjectKeys(value) {
    return Object.keys(value);
  },
  numFormat(value) {
    return value < 10 ? `0${value}` : value;
  },
  getDateTimeString(value) {
    const timestamp = +new Date(value);
    const curDate = new Date(timestamp);
    return `${curDate.getFullYear()}-${Tools.numFormat(curDate.getMonth() + 1)}-${Tools.numFormat(
      curDate.getDate(),
    )} ${Tools.numFormat(curDate.getHours())}:${Tools.numFormat(curDate.getMinutes())}:${Tools.numFormat(
      curDate.getSeconds(),
    )}`;
  },
  getDateFormatString() {
    // TODO: 设计统一日期格式为：xxxx-xx-xx xx:xx:xx 这里需要优化
    return 'YYYY-MM-DD HH:mm:ss';
  },
  getDateString(value) {
    const timestamp = +new Date(value);
    const curDate = new Date(timestamp);
    return `${curDate.getFullYear()}-${Tools.numFormat(curDate.getMonth() + 1)}-${Tools.numFormat(curDate.getDate())}`;
  },
  handleExtend(data, extend) {
    const extendKeys = this.getObjectKeys(extend);
    if (!extendKeys.length) {
      return data;
    }
    const setItemKey = (name, setK, setV) => {
      data.forEach(group => {
        (group.member || []).concat(group.advanced || []).forEach(item => {
          if (item.name === name) {
            item[setK] = setV;
          }
          if (item.subProp && item.subProp.length) {
            item.subProp.forEach(subItem => {
              if (subItem.name === name) {
                subItem[setK] = setV;
              }
            });
          }
        });
      });
    };
    extendKeys.forEach(key => {
      const itemKeys = this.getObjectKeys(extend[key]);
      itemKeys.forEach(k => {
        setItemKey(k, key, extend[key][k]);
      });
    });
    return data;
  },
  hasValue: val => val !== null && val !== undefined,
  getLanguage() {
    return localeMap[(window as any).__locale__ || (navigator && navigator.language) || 'en'];
  },
  /**
   * 设置请求头
   */
  setUploadHeader() {
    const uploadHeader = {};
    const { csrfToken = {} } = window as any;
    const { tokenName = '', tokenValue = '' } = csrfToken;
    if (tokenName) {
      Object.assign(uploadHeader, {
        [tokenName]: tokenValue,
      });
    }
    return uploadHeader;
  },
  flatString(value: string | string[], joinStr = ' ') {
    return typeof value === 'string' ? value : value.join(joinStr);
  },
  getNumberPx: str => (/^\d+$/.test(str) ? str + 'px' : str),
};

export default Tools;
