import React, { Component } from 'react';

import axios from 'axios';
import { Button, Message, Upload } from '@alifd/next';
import './index.scss';

interface internationalizationObject {
  button_import?: string;
  button_import_ok?: string;
  button_template?: string;
}

export interface IProps {
  /**
   * 确定导入回调(同步条件，参数是同步解析返回的json)
   * @default (json)=>{}
   */
  onSave?: any;

  /**
   * 指定上传文件类型
   * @default  .xlsx,.xls
   */
  accept?: string;

  /**
   * 上传文件夹名
   * @default  TypeF
   */
  folder?: string;

  /**
     * 国际化配置项
     * @default
          button_import:'文件导入',
          button_import_ok:'确定导入',
          button_template:'模版下载'
     */
  internationalization?: internationalizationObject;

  /**
   * 业务地址url
   * @default  'http://139.224.51.66:8080/api/execute'
   */
  baseUrl: string;

  /**
   *   请求参数
   */
  reqData?: Object;

  /**
   *   系统id,(比利时传参有不同)
   */
  appKey?: string;

  /**
   * 上传数量
   */
  limit?: number;

  /**
   * 限制文件上传大小
   * @default
   */
  fileSize?: number;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 下方提示文本
   */
  otherText?: string;

  /**
   * value值
   */
  value?: Array<any>;

  /**
   * beforeUrl
   */
  beforeUrl?: string;

  /**
   * @vision false
   */
  changeElementData?: (newData: any, componentKey: string) => void;
}

/**
 * 上传文件至 OSS
 * @author bowan，liuliang
 * @workNo 206388
 */
class UploadOss extends Component<IProps, any> {
  ossFile: any = '';

  private changeProps(propsValue) {
    const name = this.getInnerProps('name') || this.getInnerProps('componentKey');
    this.props.changeElementData && this.props.changeElementData(propsValue, name);
  }
  getInnerProps = key => this.props[key];

  static defaultProps = {
    onSave: () => null,
    async: false,
    accept: 'application/pdf',
    folder: 'thailand',
    internationalization: {
      button_import: '上传',
      accept_error: '文件格式不正确',
      fileSize_error: 'File size must be < 10M',
    },
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      sendFileLoading: false,
      FileList: [],
      key: '',
      host: '',
    };
  }
  // 生成唯一id
  setOnlyId = () => new Date().getTime().toString();

  getOssToken = () => {
    const { baseUrl, appKey, reqData } = this.props;
    let data = {
      interfaceName: 'com.alibaba.ewtp.common.oss.policy.CommonUploadPolicyService',
      methodName: 'getFileUploadPolicy',
    };
    if (appKey === 'ewtp-belgium') {
      data = {
        interfaceName: 'com.alibaba.ewtp.psp.service.api.UploadService',
        methodName: 'getFileUploadPolicy',
      };
    }
    const result = axios.post(baseUrl, {
      ...data,
      ...(reqData || {}),
    });
    return result;
  };
  getExtension(name) {
    // 获取文件名后缀
    return name.substring(name.lastIndexOf('.') + 1);
  }

  beforeUpload = async (file, uploadOptions) => {
    const internationalization: any = this.props.internationalization;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async e => {
        if (e.total > (this.props.fileSize || 50 * 1024) * 1024) {
          Message.error(internationalization.fileSize_error || 'File size must be < 50M');
          reject();
          return;
        }
        if (!file.type || (this.props.accept !== '*' && !this.props.accept?.includes(file.type))) {
          Message.error(internationalization.accept_error || '文件格式不正确');
          reject();
          return;
        }
        console.log(file.type, file);
        if (this.props.beforeUrl) {
          await axios.get(this.props.beforeUrl);
        }
        const token = (await this.getOssToken()).data.data;
        const filenameUid = this.setOnlyId();
        const ext = this.getExtension(file.name);
        this.setState({ sendFileLoading: true, host: token.host, key: `${this.props.folder}/${filenameUid}.${ext}` });
        uploadOptions.data = {
          name: file.name,
          key: `${this.props.folder}/${filenameUid}.${ext}`,
          policy: token.policy,
          OSSAccessKeyId: token.accessKeyId,
          signature: token.signature,
        };
        uploadOptions.headers = { 'X-Requested-With': null };
        uploadOptions.action = token.host;
        resolve(uploadOptions);
      };
      reader.readAsDataURL(file);
    });
  };

  onSuccess = (file, value) => {
    // https://ewtpsh.oss-cn-shanghai.aliyuncs.com/thailand/export/1619752934112.png

    this.setState(
      preState => ({
        FileList: [
          ...preState.FileList,
          {
            ...file,
            url: (preState.host || 'https://ewtpsh.oss-cn-shanghai.aliyuncs.com/') + preState.key,
          },
        ],
      }),
      () => {
        this.changeProps({
          value: this.state.FileList,
        });
        this.props.onSave(file, value, this.state.FileList);
      },
    );
    this.setState({ sendFileLoading: false });
  };

  onRemove = file => {
    this.setState(
      preState => ({
        FileList: preState.FileList.filter(item => item.uid !== file.uid),
      }),
      () => {
        this.changeProps({
          value: this.state.FileList,
        });
        this.props.onSave(file, this.state.FileList);
      },
    );
  };

  formatter = (res, file) => {
    return {};
  };

  render() {
    const { accept, limit, value, disabled, otherText = '' } = this.props;
    const internationalization = this.props.internationalization || UploadOss.defaultProps.internationalization;

    return (
      <div>
        <Upload
          ref={c => {
            this.ossFile = c;
          }}
          disabled={disabled}
          listType="text"
          formatter={this.formatter}
          accept={accept || UploadOss.defaultProps.accept}
          onRemove={this.onRemove}
          beforeUpload={this.beforeUpload}
          onSuccess={this.onSuccess}
          onError={file => {
            console.log(file);
            // Message.error(file);
          }}
          style={{ display: 'inline-block', marginRight: '20px' }}
          limit={limit || 1}
          value={value}
          withCredentials={false}
        >
          <Button type="primary" style={{ margin: '0 0 10px' }}>
            {internationalization.button_import}
          </Button>
        </Upload>
        <div>{(value || []).length === limit ? '' : otherText}</div>
      </div>
    );
  }
}

export default UploadOss;
