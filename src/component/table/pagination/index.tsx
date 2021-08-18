import React, { Component } from 'react';
import { Pagination as NextPagination, Select } from '@alifd/next';
import './index.scss';
import { BasicItemProps } from '../../../interface';
import { getUrlParamValue, modifyUrlParams } from '../../../utils/route-hoc';

export interface IDadaPaginationProps extends BasicItemProps {
  /**
   * 自定义国际化文案对象
   */
  locale?: any;
  /**
   * 是否展示设置页面大小下拉框
   * @default false
   */
  showPageSize?: boolean;
  /**
   * （受控）当前页码
   */
  current?: number;
  /**
   * 一页中的记录数
   * @vision true
   */
  pageSize?: number;
  /**
   * 每页显示选择器可选值
   */
  pageSizeList?: any[];
  /**
   * （非受控）初始页码
   */
  defaultCurrent?: number;
  /**
   * is sync change to url
   */
  isSyncUrl?: boolean;
  /**
   * 分页组件的大小
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 总记录数
   * @default 100
   */
  total?: number;
  type?: 'normal' | 'simple' | 'mini';

  /**
   * 前进后退按钮样式
   */
  shape?: 'normal' | 'arrow-only' | 'arrow-prev-only' | 'no-border';

  /**
   * 当页码发生改变时
   */
  onChange?: (page: number) => void;
  /**
   * 当每页显示记录数量改变时
   */
  onPageSizeChange?: (pageSize: number) => void;
  changeElementData?: (arg: any, arg2: any) => void;
  componentKey?: string;
  hideWhenNoTotal?: boolean;
}

const getMaxPageSize = ({ current = 0, pageSize = 0, total = 0 }): number => {
  try {
    const maxPageSize = Math.floor(total / pageSize) + 1;
    if (Number.isNaN(maxPageSize)) {
      throw new Error('max pageSize can not be NaN');
    }
    return Math.min(current, maxPageSize);
  } catch (e) {
    return 1;
  }
};

/**
 * @author 风水
 * @workNo 206388
 * @category Basic
 * @visible true
 * @description 分页器，一般与列表组件搭配使用
 * @vision.title 分页器(Pagination)
 * @vision.icon https://img.alicdn.com/tfs/TB1j2qUvuH2gK0jSZFEXXcqMpXa-200-200.png
 */
class Pagination extends Component<IDadaPaginationProps> {
  static displayName = 'Pagination';
  static defaultProps = {
    defaultCurrent: 1,
    current: 1,
    pageSize: 10,
    pageSizeSelector: 'dropdown',
    isSyncUrl: true,
    onPageSizeChange: () => null,
    onChange: () => null,
  };

  handlePageSizeChange = (pageSize: number) => {
    const { onPageSizeChange, current = 0, total = 0 } = this.props;
    if (onPageSizeChange) {
      onPageSizeChange.call(this, pageSize);
    }
    const targetCurrent = getMaxPageSize({ current, total, pageSize });

    this.handlerChange({ pageSize, current: targetCurrent });
  };

  handlePageChange = (current: number) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange.call(this, current);
    }
    this.handlerChange({ current });
  };

  handlerChange = changes => {
    const { changeElementData, componentKey } = this.props;

    this.modifyUrlParams(changes);

    changeElementData && changeElementData(changes, componentKey);
  };

  modifyUrlParams(changes) {
    const { isSyncUrl, name } = this.props;

    isSyncUrl && name && modifyUrlParams({ [name]: JSON.stringify(Object.assign(this.getPageValues(), changes)) });
  }

  componentWillReceiveProps(nextProps: Readonly<IDadaPaginationProps>, nextContext: any) {
    Object.entries(this.getPageValues()).forEach(([key, value]) => {
      if (nextProps[key] !== value) {
        this.modifyUrlParams({ [key]: nextProps[key] });
      }
    });
  }

  getPaginationLocal = () => {
    // const { locale = {} } = this.props;

    return {
      pageSize: '',
    };
  };

  formatNumber = val => {
    return val === undefined || val === '' ? undefined : +val;
  };

  getPageValues() {
    const { name } = this.props;

    let urlParams: any = {};
    try {
      urlParams = JSON.parse(getUrlParamValue(name));
    } catch (e) {}

    const current = urlParams.current || this.props.current;
    const pageSize = urlParams.pageSize || this.props.pageSize;

    return {
      current: current,
      pageSize: pageSize,
    };
  }

  render() {
    const {
      type,
      showPageSize = true,
      locale = {},
      className,
      defaultCurrent,
      hideWhenNoTotal = true,
      pageSizeList = [10, 20, 50, 100],
      total,
      ...restProps
    } = this.props;

    const { current, pageSize } = this.getPageValues();

    if (!total && hideWhenNoTotal) {
      return null;
    }

    const commonLocal = (locale.dada && locale.dada.common) || {};

    return (
      <div className="pagination-zone">
        {type === 'mini' ? null : (
          <span className="pagination-total">
            {commonLocal.total} {total}
          </span>
        )}

        {showPageSize && (
          <Select
            key={Date.now()}
            className="pagesize-select"
            value={pageSize}
            dataSource={pageSizeList.map(item => ({ label: `${item}`, value: item }))}
            onChange={this.handlePageSizeChange}
          />
        )}
        <NextPagination
          {...restProps}
          locale={this.getPaginationLocal()}
          type={type}
          className={className}
          total={this.formatNumber(total)}
          current={this.formatNumber(current)}
          defaultCurrent={defaultCurrent}
          pageSize={this.formatNumber(pageSize)}
          pageSizeSelector={false}
          onChange={this.handlePageChange}
          onPageSizeChange={this.handlePageSizeChange}
        />
      </div>
    );
  }
}

export default Pagination;
