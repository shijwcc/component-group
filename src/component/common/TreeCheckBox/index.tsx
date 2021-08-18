import React from 'react';
import { Tree } from '@alifd/next';

interface IProps {
  /**
   * 数据源
   */
  dataSource?: Array<any>;

  /**
   * 默认展开
   */
  defaultExpandedKeys?: Array<string>;

  /**
   * 选择
   */
  defaultCheckedKeys?: Array<string>;

  /**
   * 定义选中时回填的方式
   */
  checkedStrategy?: 'all' | 'parent' | 'child';

  /**
   * 只有一个子元素选中也返回父元素

   */
  isExpandParentNode?: boolean;

  /**
   * value值
   */
  value?: Array<any>;

  /**
   * @vision false
   */
  changeElementData?: (newData: any, componentKey: string) => void;
}

const data = [
  {
    label: 'Component',
    key: '1',
    children: [
      {
        label: 'Input',
        key: '4',
      },
      {
        label: 'Select',
        key: '5',
      },
    ],
  },
  {
    label: 'Component2',
    key: '12',
    children: [
      {
        label: 'Input2',
        key: '42',
      },
      {
        label: 'Select2',
        key: '52',
      },
    ],
  },
];

class TreeCheckBox extends React.Component<IProps, any> {
  private changeProps(propsValue) {
    const name = this.getInnerProps('name') || this.getInnerProps('componentKey');
    this.props.changeElementData && this.props.changeElementData(propsValue, name);
  }

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  getInnerProps = (key: string) => this.props[key];

  // 当子元素被选中时，传父元素
  getParentValues(value) {
    let parentKeys = [];
    (this.props.dataSource || []).forEach(item => {
      if (item.children) {
        item.children.forEach(element => {
          if (value.includes(element.key)) {
            parentKeys = parentKeys.concat(item.key);
          }
        });
      }
    });
    return Array.from(new Set(parentKeys.concat(value)));
  }

  onCheck = keys => {
    this.setState({
      value: keys,
    });
    if (this.props.isExpandParentNode) {
      this.changeProps({
        value: this.getParentValues(keys),
      });
      return;
    }
    this.changeProps({
      value: keys,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      if (!this.props.value || !this.props.value.length) {
        this.setState({
          value: '',
        });
      }
    }
  }

  render() {
    const { dataSource, checkedStrategy, defaultExpandedKeys, defaultCheckedKeys } = this.props;
    return (
      <Tree
        checkable
        checkedStrategy={checkedStrategy || 'all'}
        defaultExpandedKeys={defaultExpandedKeys || []}
        checkedKeys={this.state.value || defaultCheckedKeys || []}
        onCheck={this.onCheck}
        dataSource={dataSource || data}
      />
    );
  }
}

export default TreeCheckBox;
