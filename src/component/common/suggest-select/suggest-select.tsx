import React, { Component } from 'react';
import { Select as NextSelect } from '@alifd/next';
import { IProps } from './props';

import './index.scss';
import throttle from 'lodash/throttle';

class SuggestSelect extends Component<IProps, any> {
  static displayName = 'SuggestSelect';
  static defaultProps = {
    mode: 'single',
    options: [],
    onChange: () => null,
  };

  state = {
    value: '',
  };

  selectLabelMap: {
    [key: string]: string;
  } = {};

  handleFilter = throttle(keyword => {
    this.props.onFilter(keyword);
  }, 100);

  componentDidMount(): void {
    const { value, defaultValue, onChange } = this.props;
    if (!value && defaultValue !== undefined && onChange) {
      onChange(defaultValue);
    }
  }

  componentWillUnmount() {
    this.handleFilter.cancel();
    if (this.selectLabelMap) {
      this.selectLabelMap = {};
    }
  }

  handlerChange = value => {
    const {
      name,
      changeElementData,
      componentKey,
      onChange,
      options = [],
      keepItemLabel,
      keepItemLabelKey = 'label',
    } = this.props;
    if ('maxSelectCount' in this.props) {
      value = value.slice(0, this.props.maxSelectCount);
    }

    if (keepItemLabel && this.props.changeElementData) {
      if (Array.isArray(value)) {
        const selectedLabels: string[] = [];
        value.forEach(val => {
          if (!this.selectLabelMap[val]) {
            const curItem = options.find(item => item.value === val);
            if (curItem) {
              this.selectLabelMap[val] = curItem[keepItemLabelKey];
            }
          }
          selectedLabels.push(this.selectLabelMap[val] as string);
        });
        changeElementData({ selectedLabels }, name || componentKey);
      } else {
        const curItem = options.find(item => item.value === value);
        if (curItem) {
          const currentLabel = curItem[keepItemLabelKey];
          this.selectLabelMap[value] = currentLabel;
          changeElementData({ selectedLabels: currentLabel }, name || componentKey);
        }
      }
    }
    if (!value) {
      this.handleFilter('');
    }
    if (onChange) {
      onChange(value);
    }
    this.setState({ value: value });
  };

  onSearchClear = () => {
    console.log(11, this.state.value);
    if (!this.props.request) {
      this.handleFilter('');
    }
  };

  render() {
    const {
      className,
      options = [],
      value,
      defaultValue,
      onChange,
      popupContainer,
      maxSelectCount,
      selectPopupContainer,
      innerAfter,
      request,
      visible,
      searchQueryKey,
      ...restProps
    } = this.props;

    return (
      <NextSelect
        hasClear={true}
        {...restProps}
        onChange={this.handlerChange}
        value={'value' in this.props ? value : defaultValue}
        autoWidth={false}
        className={`suggest-select ${className}`}
        dataSource={options}
        onSearchClear={this.onSearchClear}
        popupContainer={selectPopupContainer || popupContainer}
        onSearch={this.handleFilter}
      />
    );
  }
}

export default SuggestSelect;
