interface IOptions {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
  defaultValue?: string | number;
}

export interface IProps {
  placeholder?: string;
  mode?: 'single' | 'multiple' | 'tag';
  options?: IOptions[];
  defaultValue?: string | number;
  request?: any;
  name: string;
  /**
   * value of the component
   * @vision true
   * @setter.title 组件的值
   */
  value?: string;
  /**
   * should always be true
   */
  showSearch?: boolean;
  /**
   * should always be false
   */
  filterLocal?: boolean;
  /**
   * search query key name in request data
   */
  searchQueryKey?: string;
  /**
   * only in multiple mode
   */
  maxSelectCount?: number;

  /**
   * (deprecated) save an other value in item {IOptions}, such as label
   */
  keepItemLabel?: boolean;
  /**
   * e.g. label
   */
  keepItemLabelKey?: string;
  /**
   * placeholder
   */
  className?: string;
  /**
   * should always be false or undefined
   */
  hotload?: boolean;
  /**
   * When selected value changed
   */
  onChange?: (value: any) => void;
  /**
   * popupContainer has used by dada
   */
  selectPopupContainer?: any;
  innerAfter?: string;
  visible?: boolean;
  popupContainer?: any;
  onFilter?: any;
  changeElementData?: any;
  componentKey?: any;
}
