/**
 * @notice 大家不要改, 不要瞎 import
 * docs.tsx mock 专用
 */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

/**
 * Mock DadaLoader
 */
export function MockDadaLoader(props) {
  const DadaLoader = window['DadaLoader'].default;
  return React.createElement(
    DadaLoader,
    Object.assign(props, {
      componentMap: window['COMP_LIBRARY'],
      config: Object.assign(props.config, {
        hfType: 'mock',
        dadaConfig: {
          isLoadInsideComponent: false,
        },
      }),
    }),
  );
}

/**
 * 用于Mock Dada组件中消费的RenderComponent
 * @param schema
 * @returns {any | React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
 */
export function mockRenderComponent(schema) {
  const { uiType, ...restProps } = schema;

  const componentMap: any = { ...window['COMP_LIBRARY'], DadaLoader: MockDadaLoader };

  const component = componentMap[uiType];

  if (!component) {
    return <span>Can't find {uiType}</span>;
  }

  const renderComponent = restProps.renderComponent || mockRenderComponent;

  return React.createElement(component, Object.assign(restProps, { renderComponent }));
}

/**
 * 用于提供一个弹窗容器，处理Fixed等情况
 * @param props
 */
export function MockOverlayContainer(props) {
  return React.createElement('div', {
    ...props,
    style: {
      padding: 20,
      backgroundColor: '#f0f1f5',
      minWidth: 500,
      height: 400,
      position: 'relative',
      transform: 'scale(1)',
      ...(props.style || {}),
    },
  });
}

/**
 * 用于Mock Dada组件中消费的onChange
 * @param Component
 */
export function wrapState(Component): any {
  return (props) => {
    const [value, setValue] = useState(props.value);
    const [nextProps, setNextProps] = useState({});

    const changeElementData = (newProps) => {
      setNextProps(Object.assign({}, nextProps, newProps));
    };

    return (
      <Component
        {...props}
        {...nextProps}
        value={value}
        onChange={setValue}
        itemData={props}
        changeElementData={changeElementData}
      />
    );
  };
}

/**
 * 用于渲染虚拟组件
 * @returns {(props: any) => any}
 * @param schema
 * @param Component
 */
export function renderVirtualBlock(schema, Component?: any): any {
  if (Component) {
    const schemaValue = schema.modules.length === 1 && !schema.plugins ? schema.modules[0] : schema;
    ReactDOM.render(<Component {...schemaValue} />, document.createElement('div'));
  }

  return mockRenderComponent({
    uiType: 'DadaLoader',
    config: schema,
  });
}
