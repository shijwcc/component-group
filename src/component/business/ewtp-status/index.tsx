import React from 'react';

import './index.scss';

interface IProps {
  type: 'warning' | 'info' | 'error';
  value: any;
  style: object | undefined;
  width?: string;
}

export default function EwtpStatus(props: IProps) {
  return (
    <div style={props.style} title={props.value} className="ewtp-status">
      <span style={{ maxWidth: props.width }} className={'default ' + (props.type || '')}>
        {props.value}
      </span>
    </div>
  );
}
