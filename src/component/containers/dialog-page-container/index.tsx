import * as React from 'react';
import { request, cloneJson } from '@ali-i18n-fe/intl-util';
import { Dialog } from '@alifd/next';
import { BasicItemProps, TypeAction } from '../../../interface';
import { loadByContentType, wrapDadaComponents } from './dialog-app-loader';
import Tools from '../../../utils/tool';
import './index.scss';

export interface DialogWithDashboardProps extends BasicItemProps {
  // itemData: TypeDialogItemData;
  componentKey?: string;
  contentType?: string;
  className?: string;
  title: string;
  triggerEleName?: string;
  triggerVisible?: boolean;
  width?: string | number;
  formData?: any;
  actions?: TypeAction[];
  page: any;
  closeable?: boolean;
  changeElementData?: (elementData: any, componentKey?: string) => void;
  App?: React.ComponentType;
  runAction?: (option) => void;
  showMessage?: (option) => void;
  DadaComponents?: any;
  locale?: any;
}

/**
 * @author 苏桥
 * @workNo 150261
 * @category BasicContainer
 * @description 具备独立状态上下文的弹框组件
 * @vision.isContainer true
 * @vision.title DialogPageContainer
 */
export class DialogPageContainer extends React.Component<DialogWithDashboardProps> {
  static defaultProps = {
    locale: {
      submit: 'Ok',
      cancel: 'Cancel',
    },
  };

  static displayName = 'DialogPageContainer';

  AppRef: any = false;
  saveRef = name => ref => {
    this[name] = ref;
  };

  getStore = () => {
    return this.AppRef.layoutStore || this.AppRef.tableStore;
  };

  checkRequired = () => {
    const useStore = this.getStore();
    if (useStore && useStore.checkRequired) {
      return useStore.checkRequired() ? Promise.resolve() : Promise.reject();
    }
    return Promise.resolve();
  };

  closeDialog = () => {
    const { changeElementData, name, componentKey } = this.props;
    changeElementData && changeElementData({ visible: false }, name || componentKey);
  };

  dialogSubmit = async action => {
    const { runAction = () => null, showMessage = () => null } = this.props;
    if (action && action.request && this.AppRef && this.AppRef.getFormData) {
      const formData = this.AppRef.getFormData();
      Object.entries(formData).forEach(([key, value]) => {
        formData[key] = typeof value === 'object' ? JSON.stringify(value) : value;
      });

      const store = this.getStore() || {};

      if (!(store.checkRequired && store.checkRequired())) {
        // tslint:disable-next-line:no-unused-expression
        store.scrollToError && store.scrollToError();
        return;
      }

      await request({
        crossOrigin: true,
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        withCredentials: true,
        ...action.request,
        data: { ...action.request.data, ...formData },
      }).then(res => {
        if (res.success) {
          if (res.type !== 'actions' && res.type !== 'action') {
            this.closeDialog();
            return;
          }
          const resActions: TypeAction[] = res.type === 'actions' ? res.data : [res.data];
          resActions.forEach((resAction: any) => {
            runAction({
              ...resAction,
              eventParams: Object.assign({}, resAction.eventParams),
            });
          });
          this.closeDialog();
        } else if (showMessage) {
          showMessage({ type: 'error', content: res.message || res.error || 'Submit Failed' });
        }
      });
    } else {
      this.closeDialog();
    }
  };

  onClick = action => e => {
    const ActionMap = {
      submit: this.dialogSubmit,
      cancel: this.closeDialog,
    };
    const { runAction = () => null } = this.props;
    const actionFunc = ActionMap[action.eventType];
    if (actionFunc) {
      actionFunc(action);
    } else if (this.AppRef) {
      const store = this.getStore() || {};

      if (!(store.checkRequired && store.checkRequired())) {
        // tslint:disable-next-line:no-unused-expression
        store.scrollToError && store.scrollToError();
        return;
      }

      const formData = Tools.copyObject(this.AppRef.getFormData());
      const { actions = [], eventType } = action;

      if (eventType) {
        runAction({
          ...action,
          eventParams: Object.assign({}, action.eventParams, formData, { dialogFormData: formData }),
        });
        this.closeDialog();
      } else {
        runAction(
          actions.map(item =>
            Object.assign({}, item, {
              eventParams: Object.assign({}, action.eventParams, formData, { dialogFormData: formData }),
            }),
          ),
        );
        // this.closeDialog();
      }
    } else {
      console.warn('Not found valid action');
    }
  };

  historyDataConvert = (actions: any[] = []) => {
    const res = actions.slice();
    const cancelIndex = actions.findIndex(action => action.eventType === 'cancel');
    if (cancelIndex < 0) {
      res.push({
        uiType: 'Button',
        eventType: 'cancel',
        text: this.props.locale.cancel,
        type: 'normal',
      });
    }
    return res;
  };

  renderFooter = () => {
    const { actions = [], renderComponent, locale } = this.props;

    return this.historyDataConvert(actions).map((action: any, index) => {
      const dialogLocale = locale.Dialog || {};
      const localeMap = {
        submit: dialogLocale.ok,
        ...dialogLocale,
      };
      action.text = action.text || localeMap[action.eventType];
      return (
        <span key={index} className="footer-element" onClick={this.onClick(action)}>
          {renderComponent
            ? renderComponent({
                ...action,
                eventType: false,
                noLabel: true,
              })
            : null}
        </span>
      );
    });
  };

  render() {
    const {
      // itemData,
      DadaComponents,
      locale,
      style,
      changeElementData,
      className,
      closeable = 'esc,close',
    } = this.props;
    const { contentType = 'form-page', visible, title, width = 'auto', name, formData } = this.props;
    const TargetUmdApp = loadByContentType(contentType);
    const pageData = cloneJson(this.props.page || {});

    return (
      <Dialog
        className={`${contentType} ${className} dialog-${name} page-dialog`}
        style={{ ...style, minWidth: '300px', width }}
        visible={visible}
        closeable={closeable as any}
        shouldUpdatePosition={true}
        onCancel={this.closeDialog}
        onClose={this.closeDialog}
        onOk={this.dialogSubmit}
        footer={this.renderFooter()}
        title={title}
        locale={locale}
      >
        {visible ? (
          <TargetUmdApp
            onRef={this.saveRef('AppRef')}
            labelAlign="top"
            success={true}
            {...pageData}
            formData={{ ...formData, ...pageData.formData }}
            componentMap={DadaComponents}
            changeParentElementData={changeElementData}
          />
        ) : (
          ''
        )}
      </Dialog>
    );
  }
}

export default Object.assign(wrapDadaComponents(DialogPageContainer), DialogPageContainer);
