import TableCard from '../../table/table';
import * as React from 'react';
import { loadByContentType } from '../../../utils/template-loader';
import { cloneJson, replaceObjectToken, replaceObjectTokenWithExpress } from '@ali-i18n-fe/intl-util';
import { wrapDadaComponents } from '../../containers/dialog-container/dialog-app-loader';
import isEqual from 'lodash/isEqual';
import './index.scss';

interface IExpandTable extends TableCard {
  record?: any;
  expandPage: any;
  rowOpenActions?: any;
  expandedColProps: { disabled: boolean; visible: boolean };
  DadaComponents: any;
  runAction?: any;
}

const ExpendRowRender = React.memo<any>(
  props => {
    const { expandPage = {}, DadaComponents, onRef, record } = props;
    const { pageType } = expandPage;

    let pageData = cloneJson(expandPage || {});
    pageData = replaceObjectTokenWithExpress({ expendRecord: record })(pageData);

    const TargetUmdApp = loadByContentType(pageType);
    return (
      <div className="dada-table-expanded">
        <TargetUmdApp onRef={onRef} {...pageData} componentMap={DadaComponents} />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.expendPage, nextProps.expendPage) && isEqual(prevProps.record, nextProps.record);
  },
);

class ExpandTableCard extends TableCard {
  // @ts-ignore
  props: IExpandTable;
  AppRef: any = false;

  constructor(props) {
    super(props);
    this.props = props;
  }

  saveRef = name => ref => {
    this[name] = ref;
  };

  protected getExpandedColProps = (record, index) => {
    const { expandedColProps } = this.props;
    const colProps = replaceObjectToken({ ...record, expendRecord: record })(expandedColProps);

    return { ...colProps, disabled: record.disabled || false };
  };

  protected onRowOpen = (openRowKeys, currentRowKey, expanded, currentRecord) => {
    const { rowOpenActions = [], runAction } = this.props;
    if (rowOpenActions && rowOpenActions.length && expanded && runAction) {
      rowOpenActions.forEach(action => {
        action = replaceObjectTokenWithExpress({ expendRecord: currentRecord })(action);
        runAction(action);
      });
    }
  };

  protected getDeriveProps = () => {
    return {
      expandedRowRender: this.expandedRowRender,
      getExpandedColProps: this.getExpandedColProps,
      onRowOpen: this.onRowOpen,
    };
  };

  protected expandedRowRender = record => {
    return <ExpendRowRender {...this.props} onRef={this.saveRef('AppRef')} record={record} />;
  };
}

export default wrapDadaComponents(ExpandTableCard);
