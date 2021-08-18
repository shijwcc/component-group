import * as React from 'react';
import { observable } from 'mobx';
import Tools from '../../../utils/tool';

interface IStore {
  runAction: (option) => void;
  runParentAction?: (option: any) => void;
  renderComponent: (schema: any) => React.ReactElement;
  getFormData?: () => any;
  checkRequired?: () => boolean;
  scrollToError?: () => void;
  elementDataObj?: any;
  destroy?: () => void;
  validateItemRequired?: (item: any) => boolean;
}

interface IOptions {
  store: IStore;
  childStore?: IStore;
  close: (isForce?: boolean) => void;
}

export class Connector {
  ActionMap = {
    cancel: () => this.props.close(true),
    submit: this.childRunAction.bind(this),
  };

  private props: IOptions;

  constructor(props: IOptions) {
    this.props = observable(props, {}, { deep: false });
  }

  getChildrenFormData() {
    if (!this.props.childStore || !this.props.childStore.getFormData) {
      return {};
    }
    return this.props.childStore.getFormData();
  }

  getChildrenModel() {
    if (!this.props.childStore) {
      return {};
    }
    return this.props.childStore.elementDataObj;
  }

  setChildStore(childStore: IStore) {
    childStore.runParentAction = this.props.store.runAction;
    this.props.childStore = childStore;
  }

  /**
   * Children Store 的Validator 是否都是通过的
   */
  isChildrenStoreValidate(): boolean {
    const { childStore } = this.props;
    if (!childStore) {
      return true;
    }
    return Object.values(childStore.elementDataObj).every(
      (item) => !!childStore.validateItemRequired && childStore.validateItemRequired(Object.assign({}, item)),
    );
  }

  destroy() {
    const { childStore } = this.props;
    if (childStore && childStore.destroy) {
      childStore.destroy();
    }
  }

  async runActions(action) {
    const actions = this.getActions(action);
    try {
      for (const actionData of actions) {
        const promise = this.runAction(actionData);
        !actionData.async && (await promise);
      }
      this.props.close();
    } catch (e) {
      // nothing
    }
  }

  private async runAction(action) {
    const { store, childStore } = this.props;

    if (childStore && action.eventType !== 'cancel') {
      if (!(childStore.checkRequired && childStore.checkRequired())) {
        // tslint:disable-next-line:no-unused-expression
        childStore.scrollToError && childStore.scrollToError();
        throw new Error('check required error');
      }
    }

    const actionFunc = this.ActionMap[action.eventType];
    if (actionFunc) {
      await actionFunc(action);
      return;
    }

    const { runAction } = store;

    await runAction(action);
  }

  private getActions(action): any[] {
    const { childStore } = this.props;
    if (!childStore || !childStore.getFormData) {
      return [];
    }
    const formData = Tools.copyObject(childStore.getFormData());
    const { actions = [], eventType } = action;

    function mergeEventParams(item) {
      return Object.assign({}, item, {
        ctx: { modalFormData: formData },
        eventParams: Object.assign({}, item.eventParams),
      });
    }

    if (eventType) {
      return [mergeEventParams(action)];
    } else {
      return actions.map(mergeEventParams);
    }
  }

  childRunAction(action) {
    if (!this.props.childStore) {
      return;
    }

    const { runAction } = this.props.childStore;

    // tslint:disable-next-line:no-unused-expression
    return runAction && runAction(action);
  }
}
