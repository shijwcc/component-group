import React from 'react';

import './index.scss';

export interface DividerProps {
  uiType?: string;
  className?: string;
  /**
   * width of component
   */
  width?: string | number;
  /**
   * height of component
   */
  height?: string | number;
  /**
   * content of component
   */
  content?: string;
}

class Divider extends React.Component<DividerProps> {
  static displayName = 'Separator';
  render() {
    const { className, width, height, content } = this.props;
    return content ? (
      <span className={`ui-divider ${className}`} style={{ width, height }}>
        {content}
      </span>
    ) : (
      <span className={`ui-divider ui-divider-line ${className}`} style={{ width, height }} />
    );
  }
}

export default Divider;
