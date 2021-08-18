import * as React from 'react';
import { Component } from 'react';

import axios from 'axios';
import { Button, Loading, Message, Pagination, Tab, Table, Upload } from '@alifd/next';
import './index.scss';

interface internationalizationObject {
  tap_title_1?: string;
  tap_title_2?: string;
  table_header_1?: string;
  table_header_2?: string;
  table_header_3?: string;
  table_header_4?: string;
  operation_1?: string;
  operation_2?: string;
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
   * 调用的业务组件
   * @default  TypeF
   */
  businessKey?: string;
  /**
     * 国际化配置项
     * @default  {
          tap_title_1:'导入｜下载',
          tap_title_2:'历史列表',
          table_header_1:'上传时间',
          table_header_2:'文件名',
          table_header_3:'任务状态',
          table_header_4:'操作',
          operation_1:'源文件',
          operation_2:'结果文件',
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
class UploadExcl extends Component<IProps> {
  static defaultProps = {
    onSave: json => {},
    async: false,
    templateUrl:
      'https://ewtpsh.oss-cn-shanghai.aliyuncs.com/psp-xlsx/1039%E7%BB%84%E8%B4%A7%E8%A3%85%E7%AE%B1%E6%B8%85%E5%8D%95%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx',
    accept: '.xlsx,.xls',
    businessKey: 'TypeF',
    internationalization: {
      tap_title_1: '导入｜下载',
      tap_title_2: '历史列表',
      table_header_1: '上传时间',
      table_header_2: '文件名',
      table_header_3: '任务状态',
      table_header_4: '操作',
      operation_1: '源文件',
      operation_2: '结果文件',
      button_import: '文件导入',
      button_import_ok: '确定导入',
      button_template: '模版下载',
    },
  };

  state = {
    historyList: [],
    page: 1,
    pageSize: 10,
    sendFileLoading: false,
    inputFile: '',
    fileName: '',
    historyLoading: false,
    total: 10,
  };

  downloadTem = () => {
    //模版下载
    const { templateUrl } = this.props;
    window.open(templateUrl || UploadExcl.defaultProps.templateUrl);
  };

  componentDidMount() {}

  tabChange = key => {
    //tab切换请求历史记录
    if (key == 2) {
      this.historyData();
    }
  };
  historyData = async () => {
    const { page, pageSize } = this.state;
    this.setState({ historyLoading: true });
    const data = (await this.getHistoryList(page, pageSize)).data;
    if ('success' in data && !data.success) {
      Message.error(data.errorMsg);
    }
    this.setState({
      historyList: data.rows,
      historyLoading: false,
      total: data.total,
    });
  };
  setOnlyId = () => {
    //生成唯一id
    return new Date().getTime().toString();
  };
  sendFileMes = () => {
    //发送文件信息
    const { async, onSave, businessKey, baseUrl } = this.props;
    this.setState({ sendFileLoading: true });
    axios
      .post(baseUrl, {
        interfaceName: 'com.alibaba.ewtp.psp.service.api.ExcelDocumentService',
        methodName: 'importFileFromOss',
        businessKey: businessKey || UploadExcl.defaultProps.businessKey,
        inputFile: this.state.inputFile,
        fileName: this.state.fileName,
        async: async || UploadExcl.defaultProps.async,
      })
      .then(
        res => {
          const { state, message, rows } = res.data;
          // @ts-ignore：无法被执行的代码的错误
          if (this.refs.ossFile._instance) {
            //删除上传列表
            // @ts-ignore：无法被执行的代码的错误
            this.refs.ossFile._instance.state.value = [];
          }
          if (async) {
            //async=true异步
            if (state == 'ACCEPTED') {
              Message.success('文件接受成功');
            } else if (state == 'NO_ACCEPTED') {
              Message.error(message);
            }
          } else {
            //async = fals同步
            if (state == 'SUCCESS') {
              onSave(rows);
            } else if (state == 'FAILED') {
              Message.error(message);
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
  getHistoryList = (page, pageSize) => {
    const { businessKey, baseUrl } = this.props;
    const result = axios.post(baseUrl, {
      interfaceName: 'com.alibaba.ewtp.psp.service.api.ExcelDocumentService',
      methodName: 'queryDocHistory',
      businessKey: businessKey || UploadExcl.defaultProps.businessKey,
      page,
      pageSize,
    });
    return result;
  };

  getOssToken = () => {
    const { baseUrl } = this.props;
    const result = axios.post(baseUrl, {
      interfaceName: 'com.alibaba.ewtp.common.oss.policy.CommonUploadPolicyService',
      methodName: 'getFileUploadPolicy',
    });
    return result;
  };
  getExtension(name) {
    //获取文件名后缀
    return name.substring(name.lastIndexOf('.') + 1);
  }

  beforeUpload = async (file, uploadOptions) => {
    const token = (await this.getOssToken()).data.data;
    const filenameUid = this.setOnlyId();
    const ext = this.getExtension(file.name);
    this.setState({ sendFileLoading: true });
    this.setState({
      inputFile: `thailand/${filenameUid}.${ext}`,
      fileName: file.name,
    });
    uploadOptions.data = {
      name: file.name,
      key: `thailand/${filenameUid}.${ext}`,
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
    });
  };
  onPageSizeChange = pageSize => {
    this.setState({ pageSize });
    this.historyData();
  };
  pagChange = num => {
    this.setState({ page: num });
    this.historyData();
  };
  render() {
    const { accept } = this.props;
    const internationalization = this.props.internationalization || UploadExcl.defaultProps.internationalization;
    const render = (value, index, record) => {
      return (
        <div>
          <a href={record.originOssPath}>{internationalization.operation_1}</a>&nbsp;&nbsp;&nbsp;
          {record.resultOssPath ? (
            <a href={record.resultOssPath}>{internationalization.operation_2}</a>
          ) : (
            <a style={{ color: '#000' }}>{internationalization.operation_2}</a>
          )}
        </div>
      );
    };
    function formatDate(datetime) {
      let date = new Date(datetime);
      let year = date.getFullYear(),
        month = ('0' + (date.getMonth() + 1)).slice(-2),
        sdate = ('0' + date.getDate()).slice(-2),
        hour = ('0' + date.getHours()).slice(-2),
        minute = ('0' + date.getMinutes()).slice(-2),
        second = ('0' + date.getSeconds()).slice(-2);
      return year + '-' + month + '-' + sdate + ' ' + hour + ':' + minute + ':' + second;
    }
    const timeRender = (value, index, record) => {
      return formatDate(record.creationDate);
    };
    return (
      <Tab onChange={this.tabChange}>
        <Tab.Item title={internationalization.tap_title_1} key="1">
          <div className="uploadWrap">
            <Upload
              ref="ossFile"
              formatter={this.formatter}
              listType="text"
              accept={accept || UploadExcl.defaultProps.accept}
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
                disabled={!this.state.inputFile}
              >
                {internationalization.button_import_ok}
              </Button>
              <Button style={{ margin: '0 0 10px 10px' }} onClick={this.downloadTem}>
                {internationalization.button_template}
              </Button>
            </div>
          </div>
        </Tab.Item>

        <Tab.Item title={internationalization.tap_title_2} key="2">
          <Loading visible={this.state.historyLoading} style={{ width: '100%' }}>
            <Table dataSource={this.state.historyList} crossline size="small">
              <Table.Column title={internationalization.table_header_1} cell={timeRender} />
              <Table.Column title={internationalization.table_header_2} dataIndex="fileName" />
              <Table.Column title={internationalization.table_header_3} dataIndex="taskStatus" />
              <Table.Column title={internationalization.table_header_4} cell={render} />
            </Table>
          </Loading>
          <Pagination
            pageSizeSelector="filter"
            useFloatLayout
            size="medium"
            onPageSizeChange={this.onPageSizeChange}
            onChange={this.pagChange}
            total={this.state.total}
            pageSize={this.state.pageSize}
          />
        </Tab.Item>
      </Tab>
    );
  }
}

export default UploadExcl;
