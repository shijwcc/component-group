import React from 'react';
import ReactDOM from 'react-dom';
import IComponent from './index';

export default function(Component: typeof IComponent, mountNode) {
  /** DOCS_START 请将Demo生成方法都写在以下区块内，用于生成README **/

  ReactDOM.render(
    <div style={{ width: 'max-content' }}>
      <Component current={3} total={200} type="simple" shape="arrow-only" />
      <br />
      <Component current={3} total={200} />
    </div>,
    mountNode,
  );

  /** DOCS_END **/
}
