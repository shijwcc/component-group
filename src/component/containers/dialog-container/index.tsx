//@ts-nocheck
import { request } from '@ali-i18n-fe/intl-util';
import { Dialog as NextDialog } from '@alifd/next';
import { BasicItemProps, TypeItemData, TypeAction } from '@interface/index';
import React, { Component, ComponentType } from 'react';
import { loadByContentType, wrapDadaComponents } from './dialog-app-loader';
import './index.scss';
import Tools from '../../../utils/tool';
import { toJS } from 'mobx';

const Dialog: any = NextDialog;

interface TypeDialogItemData extends TypeItemData {
  contentType: string;
  className?: string;
  visible: boolean;
  title: string;
  triggerEleName: string;
  triggerVisible: boolean;
  width?: string | number;
  formData?: any;
  actions?: TypeAction[];
  page: any;
  closeable?: boolean;
}

interface DialogWithDashboardProps extends BasicItemProps {
  itemData: TypeDialogItemData;
  changeElementData: (elementData: any, componentKey?: string) => void;
  App: ComponentType;
  runAction: (option) => void;
  showMessage: (option) => void;
  DadaComponents: any;
  locale?: any;
  triggerResize?: boolean;
}

class DialogWithDashboard extends Component<DialogWithDashboardProps> {
  static defaultProps = {
    locale: {
      submit: 'Ok',
      cancel: 'Cancel',
    },
  };

  AppRef: any = false;
  interval: any = null;
  state = {
    updateHash: new Date().getTime(),
  };
  saveRef = name => ref => {
    this[name] = ref;
  };

  componentDidMount() {
    if (this.props.triggerResize) {
      this.interval = setInterval(() => {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
      }, 2000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkRequired = () => {
    if (this.AppRef.layoutStore.checkRequired) {
      return this.AppRef.layoutStore.checkRequired() ? Promise.resolve() : Promise.reject();
    }
    return Promise.resolve();
  };

  closeDialog = () => {
    const { itemData, changeElementData } = this.props;
    changeElementData({ visible: false }, itemData.name || itemData.componentKey);
  };

  dialogSubmit = async action => {
    const { runAction = () => null, showMessage = () => null } = this.props;
    if (action && action.request && this.AppRef && this.AppRef.getFormData) {
      const formData = this.AppRef.getFormData();
      Object.entries(formData).forEach(([key, value]) => {
        formData[key] = typeof value === 'object' ? JSON.stringify(value) : value;
      });
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
              eventParams: Object.assign({}, resAction.eventParams, { dialogFormData: formData }),
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

    const store = this.AppRef.layoutStore || {};

    if (action.eventType !== 'cancel' && !(store.checkRequired && store.checkRequired())) {
      store.scrollToError && store.scrollToError();
      return;
    }

    if (actionFunc) {
      actionFunc(action);
    } else if (this.AppRef) {
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
    // @ts-ignore
    const { itemData, renderComponent, locale } = this.props;
    const { actions = [] } = itemData;
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
      itemData,
      DadaComponents,
      locale,
      style,
      changeElementData,
      className,
      closeable = 'esc,close',
    } = this.props;
    const { contentType, visible, title, width = 'auto', name, formData } = itemData;
    const TargetUmdApp = loadByContentType(contentType);

    const pageData = toJS(itemData.page || {}, { recurseEverything: true });

    return (
        <Dialog
            className={`${contentType} ${className} dialog-${name} page-dialog`}
            style={{ ...style, minWidth: '300px', width }}
            visible={visible}
            closeable={closeable}
            shouldUpdatePosition={true}
            onCancel={this.closeDialog}
            onClose={this.closeDialog}
            onOk={this.dialogSubmit}
            footer={this.renderFooter()}
            title={title}
            locale={locale}
            updateHash={this.state.updateHash}
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

export default wrapDadaComponents(DialogWithDashboard);
