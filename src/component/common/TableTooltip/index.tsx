import React, { PureComponent } from 'react';
import { Balloon } from '@alifd/next';
import './index.scss';

const Tooltip = Balloon.Tooltip;

interface IProps {
  /**
   * 基本校验宽度
   * @vision true
   */
  width?: number;

  /**
   * 内容
   * @vision true
   */
  content: string;
}

export default class LineWrap extends PureComponent<IProps, any> {
  box: any;
  text: any;
  constructor(props) {
    super(props);
    this.state = {
      isTooltip: true,
      isEllipsis: false,
      oldHeight: 0,
      maxWidth: 10000,
    };
  }

  componentDidMount() {
    const { width = 0 } = this.props;
    this.setState({
      isTooltip: this.box.offsetWidth < this.text.offsetWidth,
      isEllipsis: true,
      oldHeight: this.box.offsetHeight,
    });
    // 宽度不固定省略
    if (!(this.box.offsetWidth < this.text.offsetWidth)) {
      const offestW = Math.ceil(this.box.offsetWidth + 1);
      setTimeout(() => {
        this.setState(pre => {
          return {
            isTooltip: this.box.offsetHeight > pre.oldHeight,
            maxWidth: width > offestW ? width : offestW,
          };
        });
      }, 0);
    }
  }

  render() {
    const { content: title } = this.props;
    return (
      <div ref={v => (this.box = v)} style={{ maxWidth: this.state.maxWidth }}>
        {this.state.isTooltip ? (
          <Tooltip
            align="t"
            trigger={
              this.state.isEllipsis ? (
                <div ref={v => (this.text = v)} className={'lineEllipsis'}>
                  {title}
                </div>
              ) : (
                <span ref={v => (this.text = v)} className={'lineEllipsis'}>
                  {title}
                </span>
              )
            }
          >
            {title}
          </Tooltip>
        ) : (
          <span>{title}</span>
        )}
      </div>
    );
  }
}
