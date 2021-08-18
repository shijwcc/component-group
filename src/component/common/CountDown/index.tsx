import React, { Component } from 'react';

export interface IProps {
  /**
   * @vision false
   */
  name: string;

  /**
   * 自定义内容
   */
  total?: number;

  /**
   * 是否显示
   */
  visible?: boolean;

  /**
   * 是否显示
   */
  className?: string;

  /**
   * @vision false
   */
  changeElementData?: (newData: any, componentKey: string) => void;
}

class CountDown extends Component<IProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      num: this.props.total || 60,
      timer: 0,
      isRun: false,
    };
  }

  componentDidMount() {
    if (this.props.visible) {
      this.count();
    }
  }

  count() {
    console.log(this.state.num, this.props.total, 12);
    if (this.props.total && this.state.num < this.props.total) {
      clearInterval(this.state.timer);
      this.setState(
        {
          num: this.props.total || 60,
        },
        () => {
          console.log(this.state.num);
          this.go();
        },
      );
      return;
    }
    console.log(this.state.num);
    this.go();
  }

  go() {
    const timer = setInterval(() => {
      this.setState({
        num: this.state.num - 1,
      });
    }, 1000);
    this.setState({
      timer,
      isRun: true,
    });
  }

  componentDidUpdate(prep, pres) {
    if (!this.state.isRun && this.props.visible) {
      this.count();
      return;
    }
    if (pres.num !== this.state.num && this.state.num === 0) {
      // 改变value值方法
      const { changeElementData, name } = this.props;
      changeElementData && changeElementData({ visible: false }, name);
      clearInterval(this.state.timer);
      if (this.state.isRun) {
        this.setState({
          isRun: false,
        });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  render() {
    const { visible, className } = this.props;
    const { num } = this.state;
    return <span className={className}>{visible ? num : ''}</span>;
  }
}

export default CountDown;
