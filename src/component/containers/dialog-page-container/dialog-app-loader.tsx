import React from 'react';
import { Env, wrapUmdApp } from '@ali-i18n-fe/intl-util';

const UmdApp = ({ App, ...rest }) => <App {...rest} />;

const resourceMap = Env.getResourceMap() || {};
const TypeMap: Map<string, any> = new Map();

TypeMap.set('form-page', {
  jsCdnAddress: resourceMap.DadaFormJs,
  cssCdnAddress: resourceMap.DadaFormCss,
  rootName: 'DadaForm',
  componentName: 'DialogWithForm',
});

TypeMap.set('search-page', {
  jsCdnAddress: resourceMap.DadaTableJs,
  cssCdnAddress: resourceMap.DadaTableCss,
  rootName: 'DadaTable',
  componentName: 'DialogWithTable',
});

TypeMap.set('view-page', {
  jsCdnAddress: resourceMap.DadaDashboardJs,
  cssCdnAddress: resourceMap.DadaDashboardCss,
  rootName: 'DadaView',
  componentName: 'DialogWithView',
});

const wrapDadaComponents = wrapUmdApp({
  jsCdnAddress: resourceMap.DadaComponentJs,
  cssCdnAddress: resourceMap.DadaComponentCss,
  rootName: 'DadaComponents',
  componentName: 'DadaComponents',
});

const loadByContentType = (contentType: string) => {
  const config = TypeMap.get(contentType);
  return config ? wrapUmdApp(config)(UmdApp) : () => <div>Can't find component by contentType {contentType}</div>;
};

export { wrapDadaComponents, loadByContentType };
