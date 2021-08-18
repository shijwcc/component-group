import React, { Component } from 'react';
import { DatePicker as NextDatePicker } from '@alifd/next';

const { MonthPicker } = NextDatePicker;

import './index.scss';

export interface DateProps {
  /**
   * 时区
   */
  UTC?: string;

  /**
   * 时区
   * @vision false
   */
  utc?: string;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 输入框尺寸
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * 国际化词条
   */
  locale?: any;

  /**
   * 不允许选择的日期
   * 比如今天以前的所有日期禁止选择
   * eg. date < currentDate
   */
  disabledPickerDate?: string;

  /**
   * 日期格式
   */
  format?: string;

  /**
   * 每次选择是否重置时间（仅在 showTime 开启时有效）
   */
  resetTime?: boolean;

  /**
   * 日期值（受控）moment 对象
   */
  value?: string;

  /**
   * 输入提示
   */
  placeholder?: string;

  /**
   * 弹层默认是否显示
   */
  defaultVisible?: boolean;

  /**
   * @vision false
   */
  className?: string;

  /**
   * 弹层容器
   * @vision false
   */
  popupContainer?: string | HTMLElement | ((target: HTMLElement) => HTMLElement);

  /**
   * 当值改变时
   */
  onChange?: (value: string) => void;

  /**
   * @vision false
   */
  App?: any;

  /**
   * input state
   */
  state?: 'error' | 'loading' | 'success';

  /**
   * Error Message
   */
  error?: string;
}

class MyMonthPicker extends Component<DateProps> {
  static displayName: 'DatePicker';
  static componentName: 'DadaDatePicker';
  static defaultProps = {
    size: 'medium',
    App: window.moment,
    onChange: () => null,
  };
  currentDate = this.props.App && this.props.App();

  getDisabledFn = (() => {
    let oldCmd: string;
    let cacheFn: any;
    return () => {
      const { disabledPickerDate } = this.props;

      if (oldCmd === disabledPickerDate) {
        return cacheFn;
      }
      if (!disabledPickerDate) {
        return () => false;
      }

      cacheFn = new Function('currentDate', 'date', `return ${disabledPickerDate}`);

      oldCmd = disabledPickerDate;

      return cacheFn;
    };
  })();

  constructor(props) {
    super(props);
  }

  handleChange = value => {
    const { onChange } = this.props;
    value = +new Date(value);
    if (onChange) {
      onChange(value);
    }
  };

  disabledDate = date => {
    return this.getDisabledFn()(this.currentDate.clone(), date);
  };

  render() {
    const {
      className,
      value = '',
      size,
      format,
      locale,
      disabledPickerDate,
      popupContainer,
      App: moment,
      state,
      error,
      ...restProps
    } = this.props;

    let tempDate = moment(new Date(+value), format, true);

    const UTC = this.props.UTC || this.props.utc;

    if (UTC) {
      tempDate = tempDate.utcOffset(+UTC * 60);
    }

    const disabledDateProps = disabledPickerDate ? { disabledDate: this.disabledDate } : {};
    const valueProps = value ? { value: tempDate } : {};

    if (locale) {
      moment.locale(locale.momentLocale);
    }

    return (
      <MonthPicker
        {...restProps}
        {...disabledDateProps}
        {...valueProps}
        state={error ? 'error' : state}
        popupContainer={popupContainer}
        className={`ui-full ${className}`}
        size={size}
        onChange={this.handleChange}
        locale={locale}
      />
    );
  }
}

export default MyMonthPicker;
