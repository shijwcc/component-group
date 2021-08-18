import { ReactNode } from 'react';
// @ts-ignore
import { ContainerProps, renderComponentFunc } from '@interface/index';

export * from './config';

export type renderComponentFunc = (props: any, index?: number) => ReactNode;

export type RequestMethod = 'POST' | 'GET';

export interface TypeRequestData {
  url: string;
  method?: RequestMethod;
  data?: any;
}

export interface IAction {
  eventType: string;
  eventTarget?: string;
  [propName: string]: any;
}

export interface TypeItemData {
  name: string;
  className?: string;
  actions?: IAction[];
  request?: TypeRequestData;
  componentKey?: string;
  [propName: string]: any;
}

export interface BasicItemProps {
  className?: string; // used to customized style
  type?: string; // container type
  uiType?: string; // used for layout render
  label?: string; // pure text around the main content
  disabled?: boolean; // will replace readOnly
  content?: string | ReactNode; // means the main content for data
  itemData?: TypeItemData;
  value?: any;
  onClick?: (evt: any, action?: IAction) => void;
  onChange?: (value: any, action?: IAction) => void;
  actions?: IAction[];
  runAction?: (actions: IAction | IAction[]) => void;
  renderComponent?: renderComponentFunc;
  [propName: string]: any;
}

export interface Link extends BasicItemProps {
  target?: LinkTarget;
  href?: string; // means another page url will jump to
}

export interface Image extends BasicItemProps {
  src: string; // means the resouce will load in this page
}

export interface BasicButtonProps extends BasicItemProps {
  actionHandler?: (itemData: any, onSubmit?: (data) => void, onCancel?: (data) => void) => void; // handler action by action type
  onSubmit?: (data) => void;
  onCancel?: (data) => void;
  btnStyle?: 'primary' | 'secondary' | 'normal';
}

export interface BasicFormItemProps extends BasicItemProps {
  onChange: (newValue: any) => void; // will update the value in formData
  value: any; // formData value
  values?: any[]; // formData for multiple select/tag and so on
  size?: 'small' | 'medium' | 'large'; // form data size
}

export interface HTMLStyle {
  border?: any;
  [propName: string]: any;
}

export interface ContainerProps {
  name?: string;
  type: string;
  label?: string;
  elements: any[];
}

export interface HeaderProps {
  label: string;
  subLabel?: string;
  icon?: string;
  elements?: Link[];
}

export declare type LinkTarget = '_blank' | '_self';

export interface TypeAction {
  eventType: string;
  eventTarget?: string;
  eventPrarms?: object;
  request?: TypeRequestData;
  uiType?: string;
}

export interface IOption {
  label: string;
  value: string | number | boolean;
}

export type TriggerType = 'hover' | 'click';
