import React, { useMemo, useEffect } from 'react';
import './index.scss';
import { Balloon, Icon } from '@alifd/next';
import { setCookie, getCookie } from './util';

const { portalConfig = {} } = window as any;

interface IProps {
  languageKey?: string;
  languageList?: Array<{ desc: string; value: string }>;
  default?: string;
}

const Config = {
  languageKey: '_lang',
  languageList: portalConfig.languageList || [
    { desc: '中文', value: 'zh_CN' },
    { value: 'en_US', desc: 'English' },
    { value: 'fr_FR', desc: 'français' },
  ],
};

const LangSelect: React.FC<IProps> = function(props) {
  const getLangLabelIcon = useMemo(() => {
    const lang = getCookie(props.languageKey || '') || props.default || 'en_US';
    switch (lang) {
      case 'en_US':
        return <Icon type="icon-EN-01" />;
      case 'fr_FR':
        return <Icon type="icon-FRE-01" />;
      default:
        return <Icon type="icon-cn-01" />;
    }
  }, []);

  // 设置初始值
  useEffect(() => {
    if (!getCookie(props.languageKey || '')) {
      setCookie(props.languageKey, props.default, 30);
    }
  }, []);

  const getLangLabel = useMemo(() => {
    const lang = getCookie(props.languageKey || '') || props.default || 'en_US';
    return ((props.languageList || []).find(item => item.value === lang) || {}).desc;
  }, []);

  const getLangsSelectOptions = useMemo(() => {
    const lang = getCookie(props.languageKey || '') || props.default || 'en_US';
    return (props.languageList || []).map(item => (
      <div className="BalloonListI" onClick={() => handleChange(item.value)} key={item.value}>
        {item.desc}
        {item.value === lang ? <Icon className="langSelectIcon" type="icon-duigou_huabanfuben" /> : ''}
      </div>
    ));
  }, []);

  const handleChange = value => {
    setCookie(props.languageKey, value, 30);
    window.location.reload();
  };

  return (
    <Balloon
      popupClassName="myBalloon"
      trigger={
        <span className="BalloonContent">
          {getLangLabelIcon}
          {getLangLabel}
        </span>
      }
      triggerType="hover"
      closable={false}
    >
      {getLangsSelectOptions}
    </Balloon>
  );
};
LangSelect.defaultProps = Config;

export default LangSelect;
