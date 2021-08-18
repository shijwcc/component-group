import React, { Component } from 'react';
import { Input as NextInput } from '@alifd/next';
import { BasicFormItemProps } from '../../../interface';

import './index.scss';

export interface IInputProps extends BasicFormItemProps {
  /**
   * 输入框内的占位提示符(placeholder of component)
   * @vision true
   * @setter.title 占位符
   */
  placeholder?: string;
  /**
   * store value
   * @vision true
   * @default 默认值
   * @setter.title 输入框值
   * @vision.mock true
   * @vision.placeholder true
   * @vision.columnPlaceholder true
   */
  value: string;

  /**
   * 输入框前附加内容
   * @vision true
   * @setter.title 前缀
   * @vision.columnPlaceholder true
   */
  prefix?: string;
  /**
   * 最大长度限制
   * @vision true
   * @setter.title 最大长度
   */
  maxLength?: number;
  /**
   * disable status
   * @vision true
   * @setter.title 是否禁用
   * @vision.placeholder true
   */
  disabled?: boolean;

  /**
   * 是否展示限制长度
   * @vision true
   * @setter.title 展示限制数量
   */
  hasLimitHint?: boolean;

  /**
   * extra properties
   */
  extData?: {
    regExp?: string;
    min?: number;
    max?: number;
    regWhenValueIsNull?: boolean;
  };

  /**
   *  component style
   */
  style?: React.CSSProperties;

  /**
   *  component style
   */
  changeTypePosition?: 'before' | 'after';

  /**
   * input original HtmlType
   */
  type?: string;

  error?: string;

  /**
   * input state
   */
  state?: 'error' | 'loading' | 'success';

  /**
   * 当回车搜索时
   */
  onSearch?: (value: string) => void;

  /**
   * 当输入框失去焦点时
   */
  onBlur?: () => void;
  /**
   * 当输入框聚集焦点时
   */
  onFocus?: () => void;
}

class PasswordInput extends Component<IInputProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      isClose: true,
    };
  }

  onChange = value => {
    const { extData = {}, onChange } = this.props;
    const { regExp = '', max, min, regWhenValueIsNull } = extData;
    let changeValue = value;
    if (max !== undefined && +value > +max) {
      changeValue = +max;
    }

    if (min !== undefined && +value < +min) {
      changeValue = +min;
    }

    if (regExp) {
      if (!value && !regWhenValueIsNull) {
        // do nothing
      } else {
        try {
          const regExpInstance = new RegExp(regExp);

          if (!regExpInstance.test(value)) {
            changeValue = this.props.value || '';
          }
        } catch (e) {
          throw e;
        }
      }
    }

    onChange && onChange(changeValue);
  };
  handleOnEnter = () => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch(this.props.value);
    }
  };
  onFocus = () => `Not Implement yet`;
  onBlur = () => `Not Implement yet`;

  changhtmlType = () => {
    this.setState({
      isClose: !this.state.isClose,
    });
  };

  render() {
    const {
      value,
      className,
      type,
      state,
      placeholder,
      hasLimitHint = true,
      error,
      prefix,
      suffix,
      changeTypePosition = 'after',
      ...restProps
    } = this.props;

    return (
      <div className="dada-input-wrap">
        <NextInput
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          {...restProps}
          htmlType={this.state.isClose ? 'password' : ''}
          hasLimitHint={hasLimitHint}
          addonTextBefore={
            changeTypePosition === 'before' ? (
              <span
                className={[this.state.isClose ? 'close' : 'open', 'closeIcon'].join(' ')}
                onClick={this.changhtmlType}
              ></span>
            ) : (
              prefix
            )
          }
          addonTextAfter={
            changeTypePosition === 'after' ? (
              <span
                className={[this.state.isClose ? 'close' : 'open', 'closeIcon'].join(' ')}
                onClick={this.changhtmlType}
              ></span>
            ) : (
              suffix
            )
          }
          className={`${className}`}
          value={value}
          state={error ? 'error' : state}
          placeholder={placeholder}
          onChange={this.onChange}
          onPressEnter={this.handleOnEnter}
        />
      </div>
    );
  }
}

export default PasswordInput;
