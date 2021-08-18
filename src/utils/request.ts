import { request } from '@ali-i18n-fe/intl-util';

const dadaRequest = options =>
  request({ contentType: 'application/x-www-form-urlencoded;charset=utf-8', withCredentials: true, ...options });

export default dadaRequest;
