import React from 'react';
import ReactDOM from 'react-dom';
import IComponent, { DialogProps } from './index';
import { MockOverlayContainer, mockRenderComponent } from '../../../utils/mock';

export default function(Component: typeof IComponent, mountNode) {
  /** DOCS_START 请将Demo生成方法都写在以下区块内，用于生成README **/

  const props: DialogProps = {
    onChange(newValue: any): void {},
    visible: true,
    value: {
      address: '中国 浙江省 杭州市 余杭区 五常街道',
      mobileNumber: '13412345678',
      contact: '测试入驻031606',
      postcode: '312211',
      detailAddress: '文一西路969号',
      id: 2008642057,
      addressArea: '330110005',
      email: 'test@ceshi.com',
      isDefaultAddress: 0,
    },
    page: {
      modules: [
        {
          name: 'addressLanguage',
          options: [
            {
              label: 'Chinese',
              value: 'zh_CN',
            },
          ],
          uiType: 'Select',
          label: 'Address language',
          value: 'zh_CN',
          required: true,
        },
        {
          name: 'contact',
          uiType: 'input',
          label: 'Contact',
          required: true,
        },
        {
          name: 'detailAddress',
          uiType: 'TextArea',
          label: 'Detailed address',
          required: true,
        },
        {
          name: 'postcode',
          uiType: 'Input',
          label: 'Zip Code',
          required: true,
        },
        {
          name: 'mobileNumber',
          uiType: 'Input',
          label: 'Telephone',
          required: true,
        },
      ],
    },
    title: 'Edit Address',
    actions: [
      {
        request: {
          url: '#/submit',
        },
        needValidator: true,
        uiType: 'Button',
        text: 'Confirm',
        type: 'primary',
        actions: [
          {
            eventType: 'submit',
          },
        ],
      },
      {
        uiType: 'Button',
        text: 'Cancel',
        type: 'normal',
        actions: [
          {
            eventType: 'cancel',
          },
        ],
      },
    ],
  };

  ReactDOM.render(
    <MockOverlayContainer
      id="preview-modal-page-container"
      style={{
        width: 700,
        height: 700,
      }}
    >
      <Component {...props} renderComponent={mockRenderComponent} modalContainer="preview-modal-page-container" />
    </MockOverlayContainer>,
    mountNode,
  );

  /** DOCS_END **/
}
