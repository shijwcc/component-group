import { CSSProperties } from 'react';

export type RequestMethod = 'POST' | 'GET';

export interface TypeRequestData {
    url: string;
    method?: RequestMethod;
    data?: any;
}

export interface TypeItemData {
    name: string;
    /**
     * value of the component
     * @vision true
     * @setter.title 组件的值
     */
    value?: string;
    className?: string;
    actions?: any[];
    request?: TypeRequestData;
    componentKey?: string;
}

export interface BasicItemProps {
    /**
     * 标识组件类型的属性
     * @vision false
     */
    uiType?: string;

    /**
     * Dada 下传组件渲染方法
     * @vision false
     */
    renderComponent?: any;

    className?: string;
    style?: CSSProperties;

    /**
     * 标识组件是否禁用的属性
     */
    disabled?: boolean;

    /**
     * 标识组件的标志，请确保在页面内唯一
     * @vision false
     */
    name?: string;

    /**
     * 标识组件是否展示
     *
     * @default undefined
     */
    visible?: boolean;

    /**
     * 组件上的多语言词条
     */
    locale?: any;
}

export interface BasicButtonProps extends BasicItemProps {
    actionHandler?: (itemData: any, onSubmit: (data) => void, onCancel: (data) => void) => void;
    onSubmit?: (data) => void;
    onCancel?: (data) => void;
}

export interface BasicFormItemProps extends BasicItemProps {
    onChange?: (newValue: any) => void;
    value?: any;
    size?: 'small' | 'medium' | 'large';
}

export interface HTMLStyle {
    border?: any;
    [propName: string]: any;
}

export type LinkTarget = '_blank' | '_self';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';

export type TypeElement = {
    name?: string;
    componentKey?: string;
    type?: string;
    uiType?: string;
    elements?: TypeElement[];
} & any;

export interface TypeAction {
    eventType: string;
    eventTarget?: string;
    eventPrarms?: object;
    request?: TypeRequestData;
    uiType?: string;
}
