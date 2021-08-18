import React, { Component } from 'react';
import Url from '@ali-i18n-fe/intl-util/lib/pure-functions/urls';

export function getUrlParamValue(name) {
  return Url.getQueryString(name);
}

/**
 * 获取Value优先级
 * 1. value给定
 * 2. url参数指定
 * 3. defaultValue指定
 */
export function getUrlDefaultValue(props) {
  const { name, value, defaultValue } = props;

  /**
   * 兼容Dada下传规则，Dada会默认下传Value，直接判断Props里的Value会有是True
   * value会存在undefined 的情况，所以不能直接判断undefined
   */
  if ('value' in (props.itemData || props)) {
    return value;
  }

  const urlValue = getUrlParamValue(name);

  if (urlValue) {
    return urlValue;
  }

  if ('defaultValue' in props) {
    return defaultValue;
  }
}

export function modifyUrlParams(modifyMap) {
  const url = new URL(location.href);
  const data = Object.entries(modifyMap)
    .filter(([key]) => key !== undefined || key !== 'undefined')
    .reduce((previousValue, [key, value]) => {
      value = typeof value === 'object' ? JSON.stringify(value) : value;
      value !== undefined ? url.searchParams.set(key, value as string) : url.searchParams.delete(key);
      return Object.assign(previousValue, { [key]: value });
    }, {});

  if (!Object.keys(data).length) {
    return;
  }

  // ' ' 空格时会导致toString出错，所以需要手动解析searchParams
  url.search =
    '?' +
    // @ts-ignore
    Array.from(url.searchParams.entries())
      .map(([key, value]) => key + '=' + encodeURIComponent(value))
      .join('&');

  window.history.replaceState(data, '', url.toString());
}

export default function RouteHoc(ChildComponent) {
  class RoutedComponent extends Component<any> {
    onChange = value => {
      if (this.props.name) {
        modifyUrlParams({ [this.props.name]: value });
      }

      // @ts-ignore
      this.props.onChange && this.props.onChange(value);
    };

    render() {
      return React.createElement(ChildComponent, {
        ...this.props,
        value: getUrlDefaultValue(this.props),
        onChange: this.onChange,
      });
    }
  }

  return Object.assign(RoutedComponent, ChildComponent);
}
