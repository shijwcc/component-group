import React from 'react';
import { TypeElement } from '../../../interface';
import flatten from 'lodash/flatten';
import Tools from '../../../utils/tool';
import { replaceStr } from '../../../utils/replacer';

type IElements = TypeElement | TypeElement[];

interface IConditionElement {
  condition: string | number | boolean;
  elements: IElements;
}

export interface IProps {
  condition: string | number | boolean;
  dataSource?: Record<string, any>;
  default: IElements;
  cases: IConditionElement[];
  renderComponent: any;
}

const Condition = (props: IProps) => {
  const { cases = [], renderComponent, default: defaultElement, dataSource } = props;
  let { condition } = props;

  if (typeof condition === 'string' && !!dataSource) {
    condition = replaceStr(condition, dataSource);
  }

  let validCase: any = cases.filter(c => condition === c.condition).map(c => c.elements);
  if (!validCase.length) {
    validCase = defaultElement;
  }
  validCase = Tools.isArray(validCase) ? validCase : [validCase];
  validCase = validCase.filter(c => !!c);

  if (!validCase || validCase.length <= 0) {
    return null;
  }

  return <>{flatten(validCase).map(renderComponent)}</>;
};

export default Condition;
