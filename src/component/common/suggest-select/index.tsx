import SuggestSelectInner from './suggest-select';
import SearchRemoteHoc from '../hocs/search-remote-hoc';
import './index.scss';
import React from 'react';
import { IProps } from './props';

const SuggestSelectTmp = SearchRemoteHoc(SuggestSelectInner);

function SuggestSelect(props: IProps) {
  return <SuggestSelectTmp {...props} />;
}

export default SuggestSelect;
