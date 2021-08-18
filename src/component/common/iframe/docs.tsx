import React from 'react';
import ReactDOM from 'react-dom';
import IComponent from './index';

export default function(Component: typeof IComponent, mountNode) {
  /** DOCS_START 请将Demo生成方法都写在以下区块内，用于生成README **/

  ReactDOM.render(<Component src="https://dada.alibaba-inc.com" width={1000} height={500} />, mountNode);

  /** DOCS_END **/
}
