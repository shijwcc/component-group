import React, { Component, ReactNode } from 'react';
import { Loading } from '@alifd/next';

export interface IProps {
  /**
   * 自定义内容
   */
  tip?: string;

  /**
   * 是否显示
   */
  visible?: boolean;

  /**
   * 子元素
   */
  elements: any[];
  renderComponent: (props: any, index?: number) => ReactNode;
}

class EwtpLoading extends Component<IProps> {
  render() {
    const { elements, renderComponent, visible, tip } = this.props;
    return (
      <Loading visible={visible} tip={tip}>
        {elements && elements.map(renderComponent)}
      </Loading>
    );
  }
}

export default EwtpLoading;
