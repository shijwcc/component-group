import React, { Component, CSSProperties, ReactElement } from 'react';
import { Table } from '@alifd/next';
// import { TableProps } from '@alife/next/types/table';
import { BasicItemProps, TypeElement } from '../../../interface';
import getRowSelection from './row-selection';
import { generateUid, get, replaceObjectToken } from '@ali-i18n-fe/intl-util';
import Tools from '../../../utils/tool';
import TableCell from './table-cell';
import { action } from 'mobx';
import './index.scss';
import { IColumns } from '../columns/table-column';
import renderColumnBuilder, { IBaseColumn } from '../columns/render';
import Pagination, { IDadaPaginationProps } from '../pagination';
import createReplacer from '../../../utils/replacer';
import { getUrlParamValue, modifyUrlParams } from '../../../utils/route-hoc';
import { EmptyFunction } from '../../../constants';

export type ICellRender = {
  /**
   * if render with cache
   */
  renderWithoutCache?: boolean;
  renderCellComponent?: (itemData: any) => ReactElement;
} & TypeElement;

export type IEnumSort = 'desc' | 'asc';
export interface IDadaTableProps extends BasicItemProps {
  /**
   * 表格主键
   * @vision true
   */
  primaryKey?: string;

  /**
   * 提交字段
   * @vision true
   */
  formFields?: string | '*';

  /**
   * 是否可选
   * @vision true
   * @default false
   */
  rowSelection?: boolean;

  /**
   * 选择模式
   * @vision true
   */
  rowSelectionMode?: 'single' | 'multiple';

  /**
   * 数据源
   * @vision true
   * @default [{productInfo: "商品信息数据", sale: "12$"}]
   */
  dataSource?: any[];

  /**
   * 使用Dada组件描述的列信息
   * @vision true
   * @default [{uiType: "Text", label: "商品信息", content: "${productInfo}"}, {uiType: "Text", label: "售价", content: "${sale}"}]
   */
  columns: IBaseColumn[];

  /**
   * 要显示的Column Name数组，需在Column数组中指定Name
   */
  visibleColumns?: string[];

  /**
   * 最大选择数量
   */
  maxSelection?: number;

  /**
   * 表格loading状态
   * @vision false
   */
  loadingState?: 'runing' | 'loaded';
  /**
   * 已选择的行的PrimaryId
   * @default []
   */
  value?: string[] | number[];

  /**
   * 默认已选中的行
   * @default []
   */
  selectedRowKeys?: string[] | number[];

  /**
   * 当前排序的字段,使用此属性可以控制表格的字段的排序,格式为{dataIndex: 'asc'}
   */
  sort?: Record<string, IEnumSort>;
  hasBorder?: boolean;

  hasChildrenSelection?: boolean;

  /**
   * 定义行属性，如: { "className": "$${status?'success':'fail'}" },
   */
  rowProps?: { className: string; style: CSSProperties };

  /**
   * 当表格中的选中项改变时
   */
  onChange?: (keys: string[]) => void;

  /**
   * @vision false
   */
  changeElementData?: (newData: any, componentKey: string) => void;

  /**
   * @vision false
   */
  runAction?: (action: any) => void;

  /**
   * @vision false
   */
  onRowOpen?: (prop: any) => void;

  /**
   * @vision false
   */
  renderComponent: any;

  /**
   * Dada Template Core版本号，用于判断兼容性
   * @vision false
   */
  _dadaCoreVersion?: string;

  /**
   * @vision false
   */
  name?: string;

  /**
   * if define this table will pagination itself
   */
  pageInfo?: IDadaPaginationProps;

  /**
   * noPagination
   */
  hasPagination?: boolean;

  /**
   * disabled selection checkbox list
   */
  escapedRowKeys?: string[];

  /**
   * key name for disabled selection checkbox controller in row data (greater then escapedRowKeys)
   */
  rowSelectionDisabledKey?: string;

  /**
   * get cell props
   */
  getCellProps?: (rowIndex?, colIndex?) => any;

  /**
   * is sync change to url
   */
  isSyncUrl?: boolean;

  /**
   * passing context to child
   */
  nestReplace?: boolean;
}

const swapItem = (arr, fromIndex, toIndex) => {
  arr[toIndex] = arr.splice(fromIndex, 1, arr[toIndex])[0];
  return arr;
};

/**
 * @author 风水
 * @workNo 206388
 * @vision.icon https://img.alicdn.com/tfs/TB1D61nvEz1gK0jSZLeXXb9kVXa-200-200.png
 * @category Basic
 * @visible true
 * @description 表格组件，可用来展示列表类的数据
 * @vision.title 表格(Table)
 **/
class TableCard extends Component<IDadaTableProps> {
  static displayName = 'TableCard';
  static defaultProps = {
    primaryKey: 'id',
    formFields: '*',
    hasPagination: false,
    isSyncUrl: false,
  };

  static hocOptions = {
    getReloadParams(props) {
      const pageInfo = props.pageInfo || props?.itemData?.pageInfo;
      if (!pageInfo) {
        return null;
      }

      const propsContext = Object.assign({}, TableCard.defaultProps, props?.itemData);
      const pageFormData = TableCard.prototype.getPageInfo.call({
        props: propsContext,
      });

      const formData = { ...pageFormData } as any;

      const { sort = {} } = TableCard.prototype.getSortInfo.call({
        props: propsContext,
      });
      const sortFormData = sort && Tools.pickBy(sort, val => val !== undefined);

      if (!Tools.isEmpty(sortFormData)) {
        formData.sort = sortFormData;
      }

      return formData;
    },
  };

  private cellMap: Record<string | number, any> = {};
  private columnDataIndexMap: WeakMap<IBaseColumn, string> = new WeakMap();
  private dataIndexes: Record<string, IColumns> = {};
  private selectedRecordSnapShoot: Record<string, any> = {};

  getInnerProps = key => {
    return this.props[key] || get(this.props, ['itemData', key]);
  };

  // 已选择行数据快照，防止跨页选择数据丢失

  get selectedRowKeys() {
    const { value = [], selectedRowKeys = [] } = this.props;

    return [...value, ...selectedRowKeys];
  }

  get selectedRecords() {
    const value: any[] = this.getInnerProps('value');
    return value.map(key => {
      const record = this.getRowData(key);
      return record !== undefined ? record : this.selectedRecordSnapShoot[key];
    });
  }

  get isAsyncTable() {
    const request = this.getInnerProps('request') || {};
    return request.url || false;
  }

  _reload(params = {}) {
    // @ts-ignore
    const { runAction, name } = this.props;

    if (runAction) {
      runAction({
        eventType: 'reload',
        eventTarget: name,
        eventParams: params,
      });
    }
  }

  onPaginationChange = changes => {
    // @ts-ignore
    const { name, pageInfo, isSyncUrl } = this.props;
    if (!pageInfo) {
      return;
    }

    const pageData = Object.assign({}, pageInfo, changes);

    this.changeProps({
      pageInfo: pageData,
    });

    this.modifyUrlParams();

    this.isAsyncTable && this._reload(pageData);
  };

  registerColumn = column => {
    if (this.columnDataIndexMap.has(column)) {
      return this.columnDataIndexMap.get(column);
    }

    const dataIndex = column.dataIndex || column.name || `${generateUid()}`;
    this.columnDataIndexMap.set(column, dataIndex);
    this.dataIndexes[dataIndex] = column;

    return dataIndex;
  };

  getSubmitValue = () => {
    if (this.props.formFields) {
      return this.getFilterRecords();
    }
    return this.props.value;
  };

  getFilterRecords() {
    //@ts-ignore
    const { formFields, rowSelection, itemData = {
      useItemData: false,
      dataSource: []
    } } = this.props;

    let dataSource = [];
    // 兼容虚拟组件props上取不到值
    if(itemData && itemData.useItemData) {
      dataSource = itemData.dataSource;
    }
    else {
      dataSource = this.getInnerProps('dataSource');
    }

    if (!formFields) {
      return null;
    }
    const fields = formFields.split(',');

    // if rowSelection return selectValues , yet return dataSource
    const selectedRecords = rowSelection ? this.selectedRecords : dataSource;

    if (!selectedRecords) {
      return null;
    }

    if (fields.includes('*')) {
      return selectedRecords;
    }

    return selectedRecords.map(record => Tools.pick(record, fields));
  }

  updateDataSource = func => {
    const dataSource = func(this.props.dataSource || []);

    this.changeProps({ dataSource });
  };

  getRowData = (primaryId: string | number) => {
    const { dataSource = [], primaryKey = TableCard.defaultProps.primaryKey } = this.props;
    return dataSource.find(data => data[primaryKey] === primaryId);
  };

  createRow = ({ index = 0, record }) => {
    this.updateDataSource(dataSource => {
      dataSource.splice(index, 0, record);
      return dataSource;
    });
  };

  updateRow = ({ index, record, isMerge = false }) => {
    this.updateDataSource(dataSource => {
      if (isMerge) {
        Object.assign(dataSource[index], record);
      } else {
        dataSource.splice(index, 1, record);
      }
      return dataSource;
    });
  };

  deleteRow = ({ index }) => {
    this.updateDataSource(dataSource => {
      dataSource.splice(index, 1);
      return dataSource;
    });
  };

  updateSelectedRow = ({ record }) => {
    const selectedRecords = this.selectedRecords;
    const { primaryKey = TableCard.defaultProps.primaryKey } = this.props;
    this.updateDataSource(dataSource => {
      return dataSource.map(row => {
        if (selectedRecords.find(item => item[primaryKey] === row[primaryKey])) {
          return Object.assign(row, record);
        }
        return row;
      });
    });
  };

  updateAll = ({ record }) => {
    this.updateDataSource(dataSource => {
      dataSource.forEach(row => Object.assign(row, record));
      return dataSource;
    });
  };

  /**
   * 根据PrimaryId查询数据是否存在，若不存在则插入，否则就更新
   * @param index
   */
  upsertRow = ({ record }) => {
    if (!record) {
      return;
    }
    const { dataSource = [], primaryKey = TableCard.defaultProps.primaryKey } = this.props;
    let primaryValue = record[primaryKey];
    if (!primaryValue) {
      primaryValue = generateUid();
      record[primaryKey] = primaryValue;
    }
    const foundIndex = dataSource.findIndex(data => data[primaryKey] === primaryValue);
    if (foundIndex !== -1) {
      this.updateRow({ index: foundIndex, record });
    } else {
      this.createRow({ record });
    }
  };

  /**
   * 向上移动数据
   * @param index
   * @param step
   */
  upMoveRow = ({ index, step = 1 }) => {
    this.updateDataSource(dataSource => {
      swapItem(dataSource, index, Math.max(index - step, 0));
      return dataSource;
    });
  };

  /**
   * 向下移动数据
   * @param index
   * @param step
   */
  downMoveRow = ({ index, step = 1 }) => {
    this.updateDataSource(dataSource => {
      swapItem(dataSource, index, Math.min(index + step, dataSource.length - 1));
      return dataSource;
    });
  };

  onSort = (dataIndex, order, sort = {}) => {
    let dataSource = this.props.dataSource || [];

    const column = this.dataIndexes[dataIndex];
    if (!column) {
      console.warn('not found valid column check your `dataIndex` value!');
      return;
    }

    if (!column.sortBy) {
      return;
    }

    const sortByFrontEnd = () => {
      const replaceFn = record => replaceObjectToken({ ...record })(column.sortBy);
      dataSource = dataSource.sort((a, b) => {
        const result = replaceFn(a) > replaceFn(b);
        return order === 'asc' ? (result ? 1 : -1) : result ? -1 : 1;
      });

      this.changeProps({ dataSource });
    };

    const sortByRequest = action(() => {
      const transBySort = {};
      Object.keys(sort).forEach(key => {
        const childColumn = this.dataIndexes[dataIndex];
        transBySort[childColumn.name || key] = sort[key];
      });
      this.changeProps({ sort: null });
      this.changeProps({ sort: transBySort });

      this.modifyUrlParams();

      this._reload();
    });

    this.isAsyncTable ? sortByRequest() : sortByFrontEnd();
  };

  /**
   * When isSyncUrl true, all changes will be sync to url
   */
  modifyUrlParams() {
    const { name, isSyncUrl = false } = this.props;
    const pageInfo = this.getInnerProps('pageInfo') || {};
    const sort = this.getInnerProps('sort');
    const { current, pageSize } = pageInfo as any;

    isSyncUrl &&
      name &&
      modifyUrlParams({
        [name]: Tools.pickBy(
          {
            current,
            pageSize,
            sort,
          },
          Boolean,
        ),
      });
  }

  getPaginationResource() {
    const { dataSource = [], pageInfo, hasPagination } = this.props;

    let currentDataSource = dataSource;
    if (hasPagination && pageInfo && !('total' in pageInfo)) {
      // auto pageInfo in Front End
      const { current = 1, pageSize = 10 } = this.getPageInfo();

      currentDataSource = dataSource.slice((current - 1) * pageSize, current * pageSize);
    }

    return { dataSource: currentDataSource, pageInfo };
  }

  getPageInfo() {
    const { name, isSyncUrl, pageInfo: propsPageInfo } = this.props;

    const pageInfo =
      !!this.props.hasPagination && 'pageInfo' in this.props
        ? {
            current: 1,
            pageSize: 10,
            ...propsPageInfo,
          }
        : ({} as any);

    try {
      if (isSyncUrl) {
        const { current, pageSize } = JSON.parse(getUrlParamValue(name));
        Object.assign(
          pageInfo,
          Tools.pickBy(
            {
              current,
              pageSize,
            },
            Boolean,
          ),
        );
      }
    } catch (e) {}

    return pageInfo;
  }

  getSortInfo() {
    const { name, isSyncUrl, sort: sortInfo = {} } = this.props;

    try {
      if (isSyncUrl) {
        const { sort } = JSON.parse(getUrlParamValue(name));
        Object.assign(sortInfo, Tools.pickBy(sort, Boolean));
      }
    } catch (e) {}

    return sortInfo;
  }

  getSimiliarLength = (key, startIndex) => {
    const dataSource = this.props.dataSource || [];
    let isSimilarIndex = startIndex;
    while (isSimilarIndex < dataSource.length) {
      if (dataSource[isSimilarIndex][key] === dataSource[startIndex][key]) {
        isSimilarIndex++;
      } else {
        break;
      }
    }
    return isSimilarIndex - startIndex;
  };
  getCellProps = (rowIndex, colIndex) => {
    const { columns = [], rowSelection } = this.props;
    if (!columns[colIndex] || (rowSelection && colIndex === 0)) {
      return null;
    }
    const rowSpanKey = columns[rowSelection ? colIndex - 1 : colIndex].rowSpanKey;
    if (!rowSpanKey) {
      return null;
    }

    return {
      colSpan: 1,
      rowSpan: this.getSimiliarLength(rowSpanKey, rowIndex),
    };
  };

  render() {
    const {
      name,
      rowSelection,
      dataSource = [],
      columns = [],
      loadingState,
      sort,
      visibleColumns,
      hasBorder = false,
      pageInfo: _pageInfo,
      runAction,
      locale,
      hasPagination,
      ...restOpts
    } = this.props;

    const loading = loadingState === 'runing';

    const columnTableProps = {
      $onRegisterColumn: this.registerColumn,
      $renderCell: this.createRenderChildElement({ renderCellComponent: this.renderCell }),
      $renderComponent: this.props.renderComponent,
    };

    visibleColumns && Object.assign(columnTableProps, { $visibleColumns: visibleColumns });

    const columnRender = renderColumnBuilder({ runAction, ...columnTableProps } as any);

    const { dataSource: currentDataSource, pageInfo } = this.getPaginationResource();

    return (
      <div className="table-zone">
        <Table
          getCellProps={this.getCellProps}
          {...restOpts}
          {...this.getDeriveProps()}
          loading={loading}
          hasBorder={hasBorder}
          dataSource={currentDataSource}
          onChange={undefined}
          onSort={this.onSort}
          sort={this.getSortInfo()}
          getRowProps={this.getRowProps}
          rowSelection={
            rowSelection
              ? (getRowSelection({
                  ...this.props,
                  selectedRowKeys: this.selectedRowKeys,
                  selectItem: this.handleSelected,
                }) as any)
              : null
          }
        >
          {columns.map(columnRender)}
        </Table>
        {hasPagination && pageInfo && (
          <Pagination
            {...pageInfo}
            locale={locale}
            total={'total' in pageInfo ? pageInfo.total : dataSource.length}
            changeElementData={this.onPaginationChange}
          />
        )}
      </div>
    );
  }

  componentWillUnmount(): void {
    this.columnDataIndexMap = new WeakMap();
    this.dataIndexes = {};
  }

  /**
   * 派生值所用
   * @returns {{}}
   */
  protected getDeriveProps(): any {
    return {};
  }

  protected getRowProps = (record: {}, index: number) => {
    // @ts-ignore
    const { getRowProps, rowProps } = this.props;
    if (getRowProps) {
      return getRowProps(record, index);
    } else if (rowProps) {
      const replacedProps = createReplacer(record)({ ...rowProps });
      // console.log(replacedProps);
      return replacedProps;
    } else {
      return {};
    }
  };

  private changeProps(propsValue) {
    const { changeElementData = EmptyFunction } = this.props;
    const name = this.getInnerProps('name') || this.getInnerProps('componentKey');
    changeElementData(propsValue, name);
  }

  private handleSelected = (
    selectedRows,
    primaryKey = this.props.primaryKey as string,
    mode = this.props.rowSelectionMode,
    maxSelection = this.props.maxSelection,
  ) => {
    if (!Tools.isArray(selectedRows)) {
      selectedRows = [selectedRows];
    }

    let { value: selectedRowKeys = [] as any[] } = this.props;

    if (mode === 'single') {
      const selected: string = selectedRows[0][primaryKey];
      selectedRowKeys = [selected];
    } else {
      const keySet: Set<any> = new Set(selectedRowKeys);
      // RequireSun 2020-09-23：防止超选问题
      if (!(typeof maxSelection === 'number' && maxSelection > 0)) {
        maxSelection = Infinity;
      }
      const queueDelete: string[] = [];
      const queueAdd: string[] = [];
      for (const row of selectedRows) {
        const key = row[primaryKey];
        if (keySet.has(key)) {
          queueDelete.push(key);
        } else {
          queueAdd.push(key);
        }
      }
      for (const key of queueDelete) {
        keySet.delete(key);
      }
      // 如果超量, 就能选几个选几个
      for (const key of queueAdd) {
        if (keySet.size < maxSelection) {
          keySet.add(key);
        }
      }
      selectedRowKeys = Array.from(keySet);
    }

    this.makeSelectRecordSnapShoot(selectedRows, primaryKey);

    // tslint:disable-next-line:no-unused-expression
    this.props.onChange && this.props.onChange(selectedRowKeys as any);
    // if store-hoc not use value(deepClone), some values can not invoke rerender , such as {selected:['s','s']}
    this.forceUpdate();
  };

  private makeSelectRecordSnapShoot(selectedRows, primaryKey = this.props.primaryKey as string) {
    selectedRows.forEach(row => {
      const primaryValue = row[primaryKey];
      primaryValue in this.selectedRecordSnapShoot
        ? delete this.selectedRecordSnapShoot[primaryValue]
        : (this.selectedRecordSnapShoot[primaryValue] = Tools.copyObject(row));
    });
  }

  private createRenderChildElement: any = (tableProps: ICellRender) => (
    props: ICellRender,
    rowIndex: number | string,
  ): ((...args: any) => ReactElement) => {
    const cellRender = { ...tableProps, ...props };
    // rowIndex: number | string,
    // if cell already created ,do not create it again
    if (!this.cellMap[rowIndex] || props.renderWithoutCache) {
      const renderComponent = cellRender.renderCellComponent || this.props.renderComponent;

      // console.log('render by new Cell', rowIndex);

      this.cellMap[rowIndex] = (...args) => renderComponent(cellRender, rowIndex || cellRender.componentName, ...args);
    } else {
      // console.log('render by cache');
    }

    return this.cellMap[rowIndex];
  };

  private renderCell = (cellRender, index, value, rowIndex, record) => {
    const {
      _dadaCoreVersion,
      name = 'table',
      renderComponent,
      primaryKey = TableCard.defaultProps.primaryKey,
      nestReplace,
    } = this.props;

    const props = {
      tableName: name,
      columnIndex: cellRender.$columnIndex,
      dadaCoreVersion: _dadaCoreVersion,
      cellRender,
      value,
      rowIndex,
      record,
      renderComponent,
      deleteRow: this.deleteRow,
      updateRow: this.updateRow,
      createRow: this.createRow,
      upMoveRow: this.upMoveRow,
      downMoveRow: this.downMoveRow,
      upsertRow: this.upsertRow,
      updateAll: this.updateAll,
      updateDataSource: this.updateDataSource,
      primaryKey,
      nestReplace,
    };

    return <TableCell {...props} />;
  };
}

export default TableCard;
