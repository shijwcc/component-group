import React from 'react';
import { Env, wrapUmdApp } from '@ali-i18n-fe/intl-util';

const UmdApp = ({ App, ...rest }) => <App {...rest} />;

const formPageResourceMap = Env.getResourceByProjectName('lazada-form', 'form-page');
const searchPageResourceMap = Env.getResourceByProjectName('lazada-table', 'search-page');
const dashboardPageResourceMap = Env.getResourceByProjectName('lazada-view', 'view-page');
const componentResourceMap = Env.getResourceByProjectName('lazada-component', 'component');
const TypeMap: Map<string, any> = new Map();

TypeMap.set('form-page', {
  jsCdnAddress: formPageResourceMap.js,
  cssCdnAddress: formPageResourceMap.css,
  rootName: 'DadaForm',
  componentName: 'DialogWithForm',
});

TypeMap.set('search-page', {
  jsCdnAddress: searchPageResourceMap.js,
  cssCdnAddress: searchPageResourceMap.css,
  rootName: 'DadaTable',
  componentName: 'DialogWithTable',
});

TypeMap.set('view-page', {
  jsCdnAddress: dashboardPageResourceMap.js,
  cssCdnAddress: dashboardPageResourceMap.css,
  rootName: 'DadaView',
  componentName: 'DialogWithView',
});

const wrapDadaComponents = wrapUmdApp({
  jsCdnAddress: componentResourceMap.js,
  cssCdnAddress: componentResourceMap.css,
  rootName: 'DadaComponents',
  componentName: 'DadaComponents',
});

const loadByContentType = (contentType: string) => {
  const config = TypeMap.get(contentType);
  return config ? wrapUmdApp(config)(UmdApp) : () => <div>Can't find component by contentType {contentType}</div>;
};

export { wrapDadaComponents, loadByContentType };
