import React from 'react';
import { Table } from '@alifd/next';
import { IBaseColumn } from './render';

function TableGroupHeader(props: IBaseColumn) {
  const {
    $renderCell,
    renderCell,
    value,
    dataIndex,
    hasChildrenSelection,
    hasSelection,
    useFirstLevelDataWhenNoChildren,
  } = props;

  const cellRender = (record, index) => {
    return $renderCell({ ...props, ...renderCell }, `${dataIndex}`)(value, index, record);
  };

  return (
    <Table.GroupHeader
      cell={cellRender}
      hasChildrenSelection={hasChildrenSelection}
      hasSelection={hasSelection}
      useFirstLevelDataWhenNoChildren={useFirstLevelDataWhenNoChildren}
    />
  );
}

export default TableGroupHeader;
