import React, { Component } from 'react';

export interface IProps {
  /**
   * @vision false
   */
  name: string;

  /**
   * @vision false
   */
  changeElementData?: (newData: any, componentKey: string) => void;

  /**
   * @vision false
   */
  value?: string;
}

class EwtpLoading extends Component<IProps> {
  render() {
    // 改变value值方法
    const { changeElementData, name } = this.props;
    changeElementData && changeElementData({ value: 111 }, name);

    return <div>滑块</div>;
  }
}

export default EwtpLoading;
