import { Connector } from './connector';
import React from 'react';
import { observer } from 'mobx-react';
import { TypeElement } from '../../../interface';

export const DialogFooter = observer(
  (props: {
    actions?: TypeElement[];
    connector: Connector;
    renderComponent: any;
    locale?: any;
    spm?: string;
  }): React.ReactElement => {
    const { actions = [], connector, locale = {}, renderComponent, spm } = props;
    let footers = [...actions];

    // add cancel button
    const hasCancelBtn = actions.some(action => {
      return (
        action.eventType === 'cancel' ||
        (Array.isArray(action.actions) && action.actions.some(({ eventType }) => eventType === 'cancel'))
      );
    });
    if (!hasCancelBtn) {
      footers.push({
        uiType: 'Button',
        eventType: 'cancel',
        text: locale.cancel || 'Cancel',
        type: 'normal',
      });
    }

    // add check button disabled
    let isPageValidate;
    footers = footers.map(footerData => {
      const { uiType, needValidator } = footerData;
      if (!needValidator || uiType !== 'Button') {
        return footerData;
      }
      if (isPageValidate === undefined) {
        isPageValidate = connector.isChildrenStoreValidate();
      }
      return Object.assign({}, footerData, { disabled: !isPageValidate });
    });

    return (
      <div data-spm={spm}>
        {footers.map((schema, index) => {
          const onClick = () => connector.runActions(schema);
          const { componentKey, name, actions, ...rest } = schema;
          return (
            <span key={index} className="footer-element" onClick={onClick}>
              {renderComponent({
                ...rest,
                // remove all event
                eventType: false,
                noLabel: true,
              })}
            </span>
          );
        })}
      </div>
    );
  },
);
