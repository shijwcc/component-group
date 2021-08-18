import { Balloon, Icon } from '@alifd/next';
import React from 'react';

export const TextColumn = props => {
  const { label, tips } = props;
  if (!label) {
    return null;
  }

  return (
    <span className="render-table-column">
      <span>{label}</span>
      {tips ? (
        <span className="tips-wrapper">
          <Balloon align="t" trigger={<Icon type="help" className="dada-help" />} closable={false}>
            <span dangerouslySetInnerHTML={{ __html: tips }} />
          </Balloon>
        </span>
      ) : null}
    </span>
  );
};
