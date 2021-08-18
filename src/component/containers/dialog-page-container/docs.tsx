import React from 'react';
import ReactDOM from 'react-dom';
import IComponent, { DialogWithDashboardProps } from './index';
import { mockRenderComponent } from '../../../utils/mock';

export default function(Component: typeof IComponent, mountNode) {
  /** DOCS_START 请将Demo生成方法都写在以下区块内，用于生成README **/

  const mockData: DialogWithDashboardProps = {
    // @ts-ignore
    renderComponent: mockRenderComponent,
    title: '绑定账号FAQ',
    page: {
      modules: [
        {
          uiType: 'Text',
          content:
            "<b style='line-height:2.5' >1.为什么要绑定社交账号</b><br/><span style='color:#666666'>2015年1月5日卖家服务等级将正式生效，该等级每月末评定一次，下月3号前更新，考核 过去90天 卖家的经营能力，包括买家不良体验订单率、卖家责任裁决率、好评率等。根据考核结果将卖家划分为优秀、良好、及格和不及格卖家，不同等级的卖家将获得不同的平台资源。\n2015年1月5日卖家服务等级将正式生效，该等级每月末评定一次，下月3号前更新，考核 过去90天 卖家的经营能力，包括买家不良体验订单率、卖家责任裁决率、好评率等。根据考核结果将卖家划分为优秀、良好、及格和不及格卖家，不同等级的卖家将获得不同的平台资源。</span>",
        },
      ],
    },
  };

  ReactDOM.render(
    <div style={{ padding: 20, backgroundColor: '#f0f1f5', width: 500, height: '100%' }}>
      <Component {...mockData} />
    </div>,
    mountNode,
  );

  /** DOCS_END **/
}
