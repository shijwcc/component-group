import { arrToObj } from '@ali-i18n-fe/intl-util';

const getRowSelection = props => {
  const {
    escapedRowKeys = [],
    primaryKey = 'id',
    maxSelection = Infinity,
    rowSelectionMode = 'multiple',
    disabled = false,
    dataSource,
    selectItem,
    selectedRowKeys,
    rowSelectionDisabledKey,
  } = props;
  const escapedRowKeyMap = arrToObj(escapedRowKeys) || {};
  const enabledSelect = selectedRowKeys.filter(item => item && !escapedRowKeyMap[item[primaryKey]]);
  const isEscapedRow = record =>
    rowSelectionDisabledKey ? record[rowSelectionDisabledKey] : (escapedRowKeys || []).indexOf(record[primaryKey]) > -1;
  return {
    onChange: (ids, records) => {
      // some code
    },
    onSelect: (selected, record, records) => {
      selectItem(record, primaryKey, rowSelectionMode);
    },
    onSelectAll: (selected, records) => {
      if (selected) {
        const selectSource: any = [];
        records.forEach(item => {
          if (item && selectedRowKeys.indexOf(item[primaryKey]) === -1) {
            selectSource.push(item);
          }
        });
        records = selectSource;
        if (records.length + selectedRowKeys.length > maxSelection) {
          records.length = maxSelection - selectedRowKeys.length;
        }
      }
      if (!selected) {
        const deselectSource: any = [];
        dataSource.forEach(item => {
          if (selectedRowKeys.indexOf(item[primaryKey]) > -1 && !isEscapedRow(item)) {
            deselectSource.push(item);
          }
        });
        records = deselectSource;
      }
      selectItem(records, primaryKey);
    },
    selectedRowKeys,
    mode: rowSelectionMode,
    getProps: record => {
      return {
        disabled:
          disabled ||
          isEscapedRow(record) ||
          (enabledSelect.length >= maxSelection && !selectedRowKeys.includes(record[primaryKey])),
      };
    },
  };
};

export default getRowSelection;
