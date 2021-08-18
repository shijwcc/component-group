import React, { Component } from 'react';
import { toJS } from 'mobx';
import { Dialog } from '@alifd/next';
import { Connector } from './connector';
import { DialogFooter } from './dialog-footer';
import { BasicFormItemProps, TypeElement } from '../../../interface';

import './index.scss';

export interface DialogProps extends BasicFormItemProps {
  /**
   * 当Action执行完毕后，是否自动关闭
   */
  autoClose?: boolean;

  /**
   * ModalPage中的DadaSchema
   */
  page: any;
  width?: number;
  visible?: boolean;
  closeable?: string | boolean;
  title?: string;

  /**
   * Footer中的按钮
   */
  actions?: TypeElement[];

  /**
   * @vision false
   */
  runAction?: (option) => void;

  /**
   * @vision false
   */
  renderComponent?: any;

  /**
   * @vision false
   */
  changeElementData?: (elementData: any, componentKey?: string) => void;

  /**
   * @vision false
   */
  overlayProps?: any;

  /**
   * 渲染组件的容器，如果是函数需要返回 ref，如果是字符串则是该 DOM 的 id，也可以直接传入 DOM 节点
   */
  modalContainer?: any;

  locale?: any;

  footerSpm?: string;
}

/**
 * @author 风水
 * @workNo 206388
 * @category Feedback
 */
class ModalPage extends Component<DialogProps> {
  static defaultProps = {
    autoClose: true,
  };

  private connector: Connector;
  innerNode: any;

  constructor(props) {
    super(props);
    // @ts-ignore
    const { runAction, renderComponent } = this.props;
    this.connector = new Connector({
      // @ts-ignore
      store: { runAction, renderComponent },
      close: isForce => {
        if (!isForce && !this.props.autoClose) {
          return;
        }
        this.closeDialog();
      },
    });
    if (props.itemData) {
      props.itemData.model = new Proxy(
        {},
        {
          get: (target: {}, p: string | number | symbol) => {
            const childModel = this.connector.getChildrenModel() || {};
            if (p === 'isMobXComputedValue') {
              return true;
            }
            if (p.toString() === Symbol('mobx administration').toString()) {
              return {
                isMobXObservableObjectAdministration: true,
                getKeys() {
                  return Object.keys(childModel);
                },
              };
            }
            if (p === 'toJSON') {
              return () => JSON.stringify(childModel);
            }
            if (p === 'hasOwnProperty') {
              return () => true;
            }
            return childModel[p];
          },
        },
      );
    }
  }

  componentDidMount() {
    const { renderComponent, page, value = {} } = this.props;
    const pageData = toJS(page || {}, { recurseEverything: true });
    const formData = toJS(value || {}, { recurseEverything: true });
    this.innerNode = renderComponent({
      uiType: 'DadaLoader',
      onInitStore: this.onInitStore,
      config: Object.assign({ success: true, formData }, pageData),
    });
  }

  onInitStore = store => {
    this.connector.setChildStore(store);

    try {
      // @ts-ignore
      store.connector.props.itemData = this.props.itemData;
    } catch (e) {}

    this.updateFormData();
  };

  private updateFormData() {
    const formData = this.props.value || {};

    const patchs = Object.entries(this.connector.getChildrenFormData())
      .filter(([key]) => key in formData)
      .map(([key, value]) => ({
        name: key,
        value: formData[key],
      }));

    if (!patchs.length) {
      return;
    }

    this.connector.childRunAction({
      eventType: 'patchSchema',
      patchs,
    });
  }

  runAction = ({ actions }) => {
    this.connector.childRunAction(actions);
  };

  closeDialog = () => {
    // @ts-ignore
    const { componentKey, changeElementData } = this.props;
    // tslint:disable-next-line:no-unused-expression
    changeElementData && changeElementData({ visible: false }, componentKey);
    this.connector.destroy();
  };

  // 当调用FormData取值时
  getSubmitValue = () => {
    const { value = {} } = this.props;
    return Object.assign({}, value, this.connector.getChildrenFormData());
  };

  render() {
    const {
      className,
      visible,
      title,
      locale,
      renderComponent,
      width = 500,
      closeable = 'esc,close',
      overlayProps = {},
      modalContainer,
      actions,
      footerSpm,
    } = this.props;

    if (modalContainer) {
      overlayProps.container = modalContainer;
      overlayProps.target = modalContainer;
    }

    return (
      <Dialog
        title={title}
        className={`${className} dialog-${name} page-dialog`}
        style={{ minWidth: '300px', width }}
        visible={visible}
        shouldUpdatePosition={true}
        onCancel={this.closeDialog}
        onClose={this.closeDialog}
        overlayProps={overlayProps}
        footer={
          <DialogFooter
            locale={locale}
            actions={actions}
            renderComponent={renderComponent}
            connector={this.connector}
            spm={footerSpm}
          />
        }
        closeable={closeable as any}
        locale={locale}
      >
        {this.innerNode}
      </Dialog>
    );
  }
}

export default ModalPage;
