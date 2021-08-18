import { Table } from '@alifd/next';
import React from 'react';
import { IBaseColumn } from './render';
import { TextColumn } from './base';

export interface IColumnGroup extends IBaseColumn {
  elements: IBaseColumn[];
}

function TableColumnGroup(props: IColumnGroup) {
  const { elements, $renderColumn } = props;

  return <Table.ColumnGroup title={<TextColumn {...props} />}>{elements.map($renderColumn)}</Table.ColumnGroup>;
}

export default TableColumnGroup;
