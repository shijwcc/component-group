import { Table } from '@alifd/next';
import React from 'react';
import { ICellRender } from '../table';
import { IBaseColumn } from './render';
import { TextColumn } from './base';

export interface IColumns extends IBaseColumn {
  name?: string;
  value?: string;
  dataIndex?: string;
  width?: number;
  lock?: boolean;
  sortBy?: string | false;
  renderCell: ICellRender;
  align?: 'left' | 'center' | 'right';
}

function TableColumn(props: IColumns) {
  const {
    name,
    dataIndex,
    width,
    lock,
    align,
    sortBy,
    renderCell,
    titleElements,
    $renderCell,
    $renderComponent,
  } = props;
  const isCustomizeTitleElements = titleElements && titleElements instanceof Array;

  return (
    <Table.Column
      key={name}
      title={isCustomizeTitleElements ? titleElements.map($renderComponent) : <TextColumn {...props} />}
      dataIndex={dataIndex}
      width={width}
      lock={lock}
      sortable={!!sortBy}
      align={align}
      cell={$renderCell({ ...props, ...renderCell }, `${dataIndex}`)}
    />
  );
}

export default TableColumn;
