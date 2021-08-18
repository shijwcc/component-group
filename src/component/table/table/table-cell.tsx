import { ICellRender } from './index';
import { observer } from 'mobx-react';
import { setReplaceToken } from './utils/setReplaceToken';
import { TypeElement } from '../../../interface';
import { dataListReplaceObjectToken } from './utils';

type IMethodInterface = (record: any, index: number) => void;

interface ITableCellProps {
  tableName: string;
  cellRender: ICellRender;
  value: string;
  rowIndex: string | number;
  columnIndex: string | number;
  record: any;
  primaryKey: string;
  deleteRow?: IMethodInterface;
  updateRow?: IMethodInterface;
  createRow?: IMethodInterface;
  updateDataSource?: IMethodInterface;
  renderComponent: any;
  dadaCoreVersion?: string;
  nestReplace?: boolean;
}

const replaceObjectTokenWithOutChildren = (dataItem: Record<string, any>, index: number, element: TypeElement) => {
  const { elements, ...restSchema } = element;

  return Object.assign(dataListReplaceObjectToken(dataItem, index, restSchema), { elements });
};

/**
 * 创建一个子元素的RenderComponent方法，提供双向绑定方法
 * @param primaryKey
 * @param deleteRow
 * @param updateRow
 * @param createRow
 * @param updateDataSource
 * @param record
 * @param rowIndex
 * @param renderComponent
 * @param dadaCoreVersion
 * @returns {(renderData: any, index: any) => (any | any)}
 */
const buildRenderComponent = ({
  tableName,
  primaryKey,
  deleteRow,
  updateRow,
  createRow,
  updateDataSource,
  record,
  rowIndex,
  columnIndex,
  renderComponent,
  replaceFn,
}) => {
  let itemIndex = 0;
  const childRenderMethod = (renderData, index) => {
    const onCellChange = (cellRenderData, cellValue) => {
      if ('value' in cellRenderData) {
        setReplaceToken(record, { template: cellRenderData, setValue: cellValue });
      }
    };

    const extendProps: any = {
      rowIndex,
      record,
      primaryKey,
      deleteRow,
      updateRow,
      createRow,
      updateDataSource,
      // 保留原始Schema，以便获取占位符
      onChange: onCellChange.bind(null, renderData),
      renderComponent: childRenderMethod,
    };

    renderData = replaceFn(record, rowIndex, renderData);

    const name = `${tableName}_row${rowIndex}_column${columnIndex}_item${renderData.name || itemIndex}`;
    itemIndex++;

    delete renderData.componentKey;

    return renderComponent(Object.assign({}, extendProps, renderData, { name }), index);
  };
  return childRenderMethod;
};

const TableCell = ({
  tableName,
  primaryKey,
  cellRender,
  value,
  columnIndex,
  rowIndex,
  record,
  deleteRow,
  updateRow,
  createRow,
  updateDataSource,
  renderComponent,
  dadaCoreVersion,
  nestReplace = true,
}: ITableCellProps) => {
  const { renderCell, width, ...resetCellProps } = cellRender;

  // 兼容template-core旧版本不递归传renderComponent的问题
  const replaceFn = !!dadaCoreVersion && !nestReplace ? replaceObjectTokenWithOutChildren : dataListReplaceObjectToken;

  const render = buildRenderComponent({
    tableName,
    columnIndex,
    primaryKey,
    deleteRow,
    updateRow,
    updateDataSource,
    createRow,
    record,
    rowIndex,
    replaceFn,
    renderComponent,
  });

  const cellProps = Object.assign({}, resetCellProps, renderCell, {
    noLabel: resetCellProps.hasOwnProperty('noLabel') ? resetCellProps.noLabel : true,
  });

  if (/^Table.+?/.test(cellProps.uiType)) {
    // 兼容 TableXxxx 组件
    cellProps.value = cellProps.renderCell || value;
    if (cellProps.uiType === 'TableAction') {
      return render(Object.assign({}, cellProps, { uiType: 'InlineContainer' }), rowIndex);
    }
  }

  return render(cellProps, rowIndex);
};

export default observer(TableCell);
