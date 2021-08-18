import React from 'react';
import { Switch, Dialog } from '@alifd/next';
import requestFunc from '../../../utils/request';
// import DadaComponents from '@alife/dada-render-component';

// const { DisabledBalloon } = DadaComponents;

export interface Props {
  uiType: 'ConfirmSwitcher';
  /**
   * when do switch, send the request. Object: { url: string, param: {key:value}}
   *
   * @default {}
   */
  request?: object;
  /**
   * The params of the request
   */
  value?: boolean | string;
  /**
   * The params for Dialog.confirm. Object:  { title:string, content: string}
   *
   * @default {}
   */
  extData?: object;

  /**
   * 确定回调
   */
  onChange?: Function;

  runAction?: (option) => void;

  /**
   * Form DadaStore
   */
  sendRequest?: (request: object) => Promise<object>;
}

export default class ConfirmSwitcher extends React.Component<Props> {
  state = {
    value: this.props.value,
    itemData: this.props,
  };
  getFinalValue(value) {
    let finalValue = value;
    if (finalValue === 'true') {
      finalValue = true;
    }

    if (finalValue === 'false') {
      finalValue = false;
    }

    return finalValue;
  }
  onChange = value => {
    const { itemData = {} } = this.state;
    const { sendRequest = requestFunc, request, runAction, extData, name, actions, myActions } = itemData as any;
    Dialog.confirm({
      ...extData,
      onOk: () => {
        runAction && runAction(actions || myActions);
        if (!request) {
          this.props.onChange && this.props.onChange(value, extData);
          return;
        }
        sendRequest({
          ...request,
          data: {
            ...request.data,
            [name]: value,
            value,
          },
        }).then((data = {} as any) => {
          const { success, data: resData } = data;
          if (success) {
            this.props.onChange && this.props.onChange(value, extData);
            this.setState({
              value,
              itemData: {
                ...itemData,
                ...resData,
              },
            });
          }
        });
      },
    });
  };
  render() {
    const { value } = this.state;

    return (
      // <DisabledBalloon {...this.props}>
      <Switch {...this.props} checked={this.getFinalValue(value) as boolean} onChange={this.onChange as any} />
      // </DisabledBalloon>
    );
  }
}
