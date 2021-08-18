import React from 'react';
import ReactDOM from 'react-dom';
import IComponent from './index';
import { mockRenderComponent, wrapState } from '../../../utils/mock';

export default {
  TableSelect: function(Component: typeof IComponent, mountNode) {
    /** DOCS_START 请将Demo生成方法都写在以下区块内，用于生成README **/

    const itemData = {
      rowSelection: true,
      dataSource: [],
      hotload: true,
      request: {
        url: 'https://mocks.alibaba-inc.com/mock/dada/table_mock',
      },
      value: ['2201715003436'],
      columns: [
        {
          uiType: 'Text',
          label: 'Sub Account Name',
          width: '250px',
          content: '${id}',
          sortBy: '${id}',
        },
        {
          uiType: 'Text',
          label: 'Status',
          width: '200px',
          content: '${status}',
        },
        {
          uiType: 'InlineContainer',
          label: 'Action',
          clazzName: 'table-action',
          width: '200px',
          elements: [
            {
              uiType: 'Button',
              type: 'link',
              text: '${status}',
              eventType: 'sendRequest',
              request: {
                url: 'https://mocks.alibaba-inc.com/mock/dada/lazada/manage/list/enable',
                data: {
                  id: '${id}',
                },
              },
            },
            {
              uiType: 'Button',
              type: 'link',
              text: 'Edit',
              href: 'https://www.taobao.com?id=${subUserId}',
            },
            {
              uiType: 'Button',
              type: 'link',
              text: 'Delete',
              href: 'https://www.taobao.com?id=${subUserId}',
            },
          ],
        },
      ],
    };

    const StateComponent = wrapState(Component);

    ReactDOM.render(
      <div style={{ width: 700 }}>
        <StateComponent {...itemData} renderComponent={mockRenderComponent} />
      </div>,
      mountNode,
    );

    /** DOCS_END **/
  },
  BasicTable: function(Component: typeof IComponent, mountNode) {
    /** DOCS_START 请将Demo生成方法都写在以下区块内，用于生成README **/

    const itemData = {
      dataSource: [
        {
          id: '2201715003437',
          userName: 'asdf',
          status: 'Enabled',
          email: 'asdf@asdf333.df343f4',
          roleNames: '订单管理;退货管理',
        },
        {
          id: '2201715003437',
          userName: 'asdf',
          status: 'Enabled',
          email: 'asdf@asdf333.df343f4',
          roleNames: '订单管理;退货管理',
        },
        {
          id: '2201715003437',
          userName: 'asdf',
          status: 'Enabled',
          email: 'asdf@asdf333.df343f4',
          roleNames: '订单管理;退货管理',
        },
      ],
      columns: [
        {
          uiType: 'Text',
          label: 'Sub Account Name',
          width: '250px',
          content: '${id}',
          sortBy: '${id}',
        },
        {
          uiType: 'Text',
          label: 'Status',
          width: '200px',
          content: '${status}',
        },
      ],
    };

    ReactDOM.render(
      <div style={{ width: 700 }}>
        <Component {...itemData} renderComponent={mockRenderComponent} />
      </div>,
      mountNode,
    );

    /** DOCS_END **/
  },
  TableGroupHeader: function(Component: typeof IComponent, mountNode) {
    const itemData = {
      rowSelection: true,
      dataSource: [
        {
          price: '112',
          id: '345654345654',
          children: [
            {
              price: '12',
              status: 'done',
              id: '11',
              product: [
                {
                  uiType: 'Link',
                  content: 'IDJ2EUP5',
                  href: 'https://www.lazada.co.id/products/-i695126521-s965266718.html',
                  target: '_blank',
                },
                { uiType: 'Text', content: 'LazMall - MP local' },
              ],
            },
            {
              price: '100',
              status: 'failed',
              id: '12',
              product: [
                {
                  uiType: 'Link',
                  content: 'IDJ2DMDE',
                  href: 'https://www.lazada.co.id/products/-i408064151-s451559772.html',
                  target: '_blank',
                },
                { uiType: 'Text', content: 'LazMall - Retail' },
              ],
            },
          ],
        },
        {
          price: '67',
          parent: 'root',
          id: '345654345655',
          children: [
            {
              price: '17',
              status: 'processing',
              id: '21',
              product: [
                {
                  uiType: 'Link',
                  content: 'ID13GHM',
                  href: 'https://www.lazada.co.id/products/-i694048336-s961914368.html',
                  target: '_blank',
                },
                { uiType: 'Text', content: 'LazMall - MP local' },
              ],
            },
            {
              price: '50',
              status: 'done',
              id: '22',
              product: [
                {
                  uiType: 'Link',
                  content: 'IDJ2I8RG',
                  href: 'https://www.lazada.co.id/products/-i506390405-s656788393.html',
                  target: '_blank',
                },
                { uiType: 'Text', content: 'Lazada - MP' },
              ],
            },
          ],
        },
      ],
      columns: [
        {
          columnUiType: 'TableGroupHeader',
          name: 'aaa',
          hasChildrenSelection: true,
          hasSelection: false,
          uiType: 'FloatContainer',
          elements: [
            {
              uiType: 'InlineContainer',
              elements: [
                {
                  uiType: 'Text',
                  label: 'Main No',
                },
                {
                  name: 'ssssss',
                  uiType: 'Button',
                  type: 'link',
                  text: '${id}',
                  href: 'https://www.taobao.com?id=${id}',
                },
              ],
            },
            {
              uiType: 'Text',
              label: 'Total Price',
              floatStyle: 'right',
              content: '${price}',
            },
          ],
        },
        {
          uiType: 'InlineContainer',
          label: 'Product',
          elements: '${product}',
          name: 'product',
          width: '300px',
        },
        { uiType: 'Text', label: 'Price', width: '200px', content: '${price}' },
        { uiType: 'Text', label: 'Status', width: '200px', content: '${status}' },
        {
          uiType: 'InlineContainer',
          label: 'Action',
          width: '200px',
          elements: [{ uiType: 'Button', type: 'link', text: 'Detail', href: 'https://www.taobao.com?id=${id}' }],
        },
      ],
    };

    const StateComponent = wrapState(Component);

    ReactDOM.render(
      <div style={{ width: '90%', margin: '24px' }}>
        <StateComponent {...itemData} renderComponent={mockRenderComponent} />
      </div>,
      mountNode,
    );

    /** DOCS_END **/
  },
};
