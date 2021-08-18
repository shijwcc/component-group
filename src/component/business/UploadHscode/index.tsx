import * as React from 'react';
import { Component } from 'react';

import axios from 'axios';
import {
  Input,
  Button,
  // Loading,
  Message,
  Upload,
} from '@alifd/next';
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
   * 是否同步处理拿到解析json
   * @default false
   */
  async?: boolean;
  /**
   * 模版url
   * @default ewtp泰国项目的模版
   */
  templateUrl?: string;
  /**
   * 指定上传文件类型
   * @default  .xlsx,.xls
   */
  accept?: string;
  /**
     * 国际化配置项
     * @default  {
          button_import:'文件导入',
          button_import_ok:'确定导入',
          button_template:'模版下载',
      }
     */
  internationalization?: internationalizationObject;
  /**
   * 业务地址url
   * @default  'http://139.224.51.66:8080/api/execute'
   */
  baseUrl: string;
}

/**
 * 上传文件至 OSS
 * @author bowan
 * @workNo 206388
 */
class UploadHscode extends Component<IProps> {
  static defaultProps = {
    onSave: json => ({}),
    async: true,
    templateUrl:
      'https://ewtpsh.oss-cn-shanghai.aliyuncs.com/psp-xlsx/1039%E7%BB%84%E8%B4%A7%E8%A3%85%E7%AE%B1%E6%B8%85%E5%8D%95%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx',
    accept: '.xlsx,.xls',
    businessKey: 'TypeF',
    internationalization: {
      button_import: '文件导入',
      button_import_ok: '确定导入',
      button_template: '模版下载',
    },
  };

  state = {
    sendFileLoading: false,
    inputFile: '',
    fileName: '',
    fileVersion: '',
  };

  downloadTem = () => {
    //模版下载
    const { templateUrl } = this.props;
    window.open(templateUrl || UploadHscode.defaultProps.templateUrl);
  };

  componentDidMount() {}

  setOnlyId = () => {
    //生成唯一id
    return new Date().getTime().toString();
  };
  sendFileMes = () => {
    //发送文件信息
    const { async, onSave, baseUrl } = this.props;
    this.setState({ sendFileLoading: true });
    axios
      .post(baseUrl, {
        interfaceName: 'com.alibaba.ewtp.api.hscode.ITaxRateFileHistoryService',
        methodName: 'parsingData',
        fileVersion: this.state.fileVersion,
        filePath: this.state.inputFile,
        async: async || UploadHscode.defaultProps.async,
      })
      .then(
        res => {
          const { rows } = res.data;
          // @ts-ignore
          const { success, error } = res.data;
          console.log(res, 'sendFileMes res');
          // @ts-ignore：无法被执行的代码的错误
          if (this.refs.ossFile._instance) {
            //删除上传列表
            // @ts-ignore：无法被执行的代码的错误
            this.refs.ossFile._instance.state.value = [];
          }
          if (async) {
            //async=true异步
            if (success) {
              console.log(11111, '走这了');
              Message.show({
                type: 'success',
                content: '文件上传成功',
              });
            } else {
              Message.error(error);
            }
          } else {
            //async = fals同步
            if (success) {
              onSave(rows);
            } else {
              Message.error(error);
            }
          }
          this.setState({ sendFileLoading: false });
          this.setState({
            inputFile: '',
            fileName: '',
          });
        },
        err => {
          Message.error(err);
          this.setState({ sendFileLoading: false });
        },
      );
  };

  getOssToken = () => {
    const { baseUrl } = this.props;
    const result = axios.post(baseUrl, {
      interfaceName: 'com.alibaba.ewtp.oss.api.CommonUploadPolicyService',
      methodName: 'getFileUploadPolicy',
    });
    return result;
  };
  getExtension(name) {
    //获取文件名后缀
    return name.substring(name.lastIndexOf('.') + 1);
  }

  beforeUpload = async (file, uploadOptions) => {
    const data = (await this.getOssToken()).data;
    const token = data.data;
    console.log(data, 'gettoken');
    // @ts-ignore
    if (!data.success) {
      // @ts-ignore
      Message.error(data.error);
    }
    const filenameUid = this.setOnlyId();
    const ext = this.getExtension(file.name);
    this.setState({ sendFileLoading: true });
    this.setState({
      inputFile: `file/${filenameUid}.${ext}`,
      fileName: file.name,
    });
    uploadOptions.data = {
      name: file.name,
      key: `file/${filenameUid}.${ext}`,
      policy: token.policy,
      OSSAccessKeyId: token.accessKeyId,
      signature: token.signature,
    };
    uploadOptions.headers = { 'X-Requested-With': null };
    uploadOptions.action = token.host;
    this.setState({ sendFileLoading: true });
    return uploadOptions;
  };
  formatter = (res, file) => {
    return {};
  };
  onSuccess = (file, value) => {
    this.setState({ sendFileLoading: false });
  };
  onRemove = file => {
    this.setState({
      inputFile: '',
      fileName: '',
      sendFileLoading: false,
    });
  };
  fileVersionChange = (value, e) => {
    this.setState({ fileVersion: value });
  };
  render() {
    const { accept } = this.props;
    const internationalization = this.props.internationalization || UploadHscode.defaultProps.internationalization;
    return (
      <div className="uploadWrap">
        <div style={{ marginBottom: '15px' }}>
          <p>文件版本号：</p>
          <Input placeholder="请输入版本号" onChange={this.fileVersionChange} />
        </div>
        <Upload
          ref="ossFile"
          formatter={this.formatter}
          listType="text"
          accept={accept || UploadHscode.defaultProps.accept}
          onRemove={this.onRemove}
          beforeUpload={this.beforeUpload}
          onSuccess={this.onSuccess}
          onError={(file, value) => {
            // @ts-ignore
            Message.error(value);
          }}
          style={{ display: 'inline-block', marginRight: '20px' }}
          limit={1}
          withCredentials={false}
        >
          <Button type="primary" style={{ margin: '0 0 10px' }}>
            {internationalization.button_import}
          </Button>
        </Upload>
        <div>
          <Button
            style={{ margin: '0 0 10px' }}
            type="primary"
            onClick={this.sendFileMes}
            loading={this.state.sendFileLoading}
            disabled={!this.state.inputFile || !this.state.fileVersion}
          >
            {internationalization.button_import_ok}
          </Button>
          <Button style={{ margin: '0 0 10px 10px' }} onClick={this.downloadTem}>
            {internationalization.button_template}
          </Button>
        </div>
      </div>
    );
  }
}

export default UploadHscode;
