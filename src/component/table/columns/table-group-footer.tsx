import React from 'react';
import { Table } from '@alifd/next';
import { IBaseColumn } from './render';

function TableGroupFooter(props: IBaseColumn) {
  const { $renderCell, renderCell, value, dataIndex } = props;

  const cellRender = (record, index) => {
    return $renderCell({ ...props, ...renderCell }, `${dataIndex}`)(value, index, record);
  };

  return <Table.GroupFooter cell={cellRender} />;
}

export default TableGroupFooter;
