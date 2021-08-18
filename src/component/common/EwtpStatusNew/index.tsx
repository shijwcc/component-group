import React, { ReactNode } from 'react';
import './index.scss';

interface IProps {
  type: 'warning' | 'success' | 'error' | 'defalut';
  value: any;
  style?: object;
  width?: string;
  elements?: any[];
  renderComponent: (props: any, index?: number) => ReactNode;
  actions?: Array<any>;
  runAction?: (option) => void;
}

const EwtpStatusNew: React.FC<IProps> = function(props) {
  const runAction = () => {
    const { runAction, actions } = props;
    runAction && runAction(actions);
  };
  return (
    <div style={props.style} onClick={runAction} title={props.value} className="ewtp-status-new">
      <span style={{ maxWidth: props.width }}>
        <i className={'statusIcon ' + (props.type || '')}>
          <i />
        </i>
        {props.elements ? props.elements && props.elements.map(props.renderComponent) : props.value}
      </span>
    </div>
  );
};
export default EwtpStatusNew;
