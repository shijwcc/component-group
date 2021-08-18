import columnMap from './index';
import { ReactElement } from 'react';

export type IBaseColumn = {
  columnUiType?: string;
  renderColumn?: (props: IBaseColumn) => ReactElement;
  name?: string;
  label: string;
  itemData: any;
} & any;

export interface ITableProps {
  $onRegisterColumn: (column: IBaseColumn) => string;
  $visibleColumns?: string[];
  $renderCell?: (rowIndex: string) => (...args: any) => ReactElement;
  runAction?: any;
  $renderComponent?: any;
}

const renderColumnBuilder = (tableProps: ITableProps) => {
  const $renderColumn = (props: IBaseColumn, columnIndex) => {
    const { $visibleColumns, $onRegisterColumn, $renderCell, runAction, $renderComponent } = tableProps;

    const columnVisible = $visibleColumns ? $visibleColumns.includes(props.name) : true;

    const dataIndex = $onRegisterColumn(props);
    const columnComponent = columnMap[props.columnUiType || 'TableColumn'];

    return (
      columnVisible &&
      columnComponent &&
      columnComponent({
        $renderCell,
        $renderColumn,
        $columnIndex: columnIndex,
        $renderComponent,
        dataIndex,
        runAction,
        ...props,
      })
    );
  };
  return $renderColumn;
};

export default renderColumnBuilder;
