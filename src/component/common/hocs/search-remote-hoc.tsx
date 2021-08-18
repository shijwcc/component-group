import React, { Component } from 'react';
import { Message } from '@alifd/next';
import { getItemByPos, withNoAddonRequestParams } from '../../../utils/util';
import { RequestStatus } from '../../../utils/constants';

const doNothing = (...params) => params;

const appendNodeToTree = ({ currentOptions, childOptions, itemData }) => {
  const newOptions = currentOptions.slice();
  const currentItemData = getItemByPos(itemData.pos, newOptions);
  const isLeaf = !childOptions || childOptions.length === 0;
  if (isLeaf) {
    currentItemData.isLeaf = isLeaf;
  } else {
    currentItemData.children = childOptions;
  }
  return newOptions;
};

export default (
  TargetComp,
  {
    formatLoadDataParams = doNothing,
    formatNewOptions = appendNodeToTree,
    formatRequestParams = withNoAddonRequestParams,
  }: {
    formatLoadDataParams?(params: any, props?: any): any;
    formatNewOptions?(
      params: {
        currentOptions: any;
        childOptions: any;
        itemData: any;
        props: any;
      },
      restParams?: any,
    ): any;
    formatRequestParams?(params: { queryKeyword: string; itemData: any }, props?: any): any;
  } = {},
) => {
  class SearchRemoteWrap extends Component<any, any> {
    private wrappedComp: React.Ref<any>;

    constructor(props) {
      super(props);

      this.state = {
        options: props.options || [],
        optionsLocal: props.options || [],
        loadingStatus: RequestStatus.pending,
        loadingError: null,
      };
    }

    componentDidUpdate(prep) {
      if ((this.props.options || []).length !== (prep.options || []).length) {
        this.setState({ options: this.props.options || [] });
      }
      if (!prep.value && this.props.value && !this.state.options.find(item => item.value === this.props.value)) {
        this.handleFilter(this.props.value);
      }
    }

    handleFilter = async keyword => {
      this.setState({ loadingStatus: RequestStatus.loading, loadingError: null });
      const { request, searchQueryKey = 'query', nodeValueQueryKey = 'id', runAction } = this.props;
      try {
        request.data = {
          ...(request.data || {}),
          [searchQueryKey]: keyword,
          [nodeValueQueryKey]: '',
          ...formatRequestParams({ queryKeyword: keyword, itemData: null }, this.props),
        };
        const { success, data } = await runAction({
          eventType: 'sendRequest',
          eventParams: {
            request,
          },
        });
        if (success && data) {
          this.setState({ options: data.options || [], loadingStatus: RequestStatus.success }); // replace root options
        }
      } catch (err) {
        if (this.props.options.length) {
          this.setState({
            loadingStatus: RequestStatus.error,
            loadingError: err.message,
            options: this.props.options.filter(
              item => String(item.label).includes(keyword) || String(item.value).includes(keyword),
            ),
          });
          return;
        }
        console.error(err, 22);
        this.setState({ loadingStatus: RequestStatus.error, loadingError: err.message, options: [] });
      }
    };

    // load tree data trigger when node expanded (use in tree mode only, child component should implement node loading state)
    handleLoadDataInner = (itemData, ...restParams) => {
      const { request, searchQueryKey = 'query', nodeValueQueryKey = 'id', runAction } = this.props;
      const { searchValue } = this.state;
      return Promise.resolve()
        .then(() => {
          request.data = {
            ...(request.data || {}),
            [searchQueryKey]: searchValue,
            [nodeValueQueryKey]: itemData.value,
            ...formatRequestParams({ queryKeyword: searchValue, itemData }, this.props),
          };
        })
        .then(() => {
          return runAction({
            eventType: 'sendRequest',
            eventParams: {
              request,
            },
          });
        })
        .then(({ success, data }) => {
          if (success && data) {
            const { options } = data;

            this.setState({
              options: formatNewOptions(
                {
                  currentOptions: this.state.options,
                  childOptions: options,
                  itemData,
                  props: this.props,
                },
                restParams,
              ),
            });
          }
        })
        .catch(err => {
          console.error(err);
          Message.error(err.message || 'load data failed');
        });
    };
    handleLoadData = itemData => this.handleLoadDataInner(...(formatLoadDataParams(itemData, this.props) as [any]));

    handleResetData = () => {
      this.handleFilter('');
    };

    saveRef = ref => {
      if (this.wrappedComp) {
        return;
      }
      this.wrappedComp = ref;
      Object.keys(ref).forEach(key => {
        if (!this[key] && typeof ref[key] === 'function') {
          this[key] = ref[key];
        }
      });
      this.props.onRef && this.props.onRef(this);
    };

    render(): React.ReactNode {
      const { searchQueryKey, nodeValueQueryKey, TargetComponent, ...restProps } = this.props;
      const { options, loadingStatus, loadingError } = this.state;
      return (
        <TargetComponent
          {...restProps}
          ref={this.saveRef}
          onFilter={this.handleFilter}
          onLoadData={this.handleLoadData}
          onResetData={this.handleResetData}
          options={options}
          loadingStatus={loadingStatus}
          loadingError={loadingError}
        />
      );
    }
  }

  return props => {
    return <SearchRemoteWrap {...props} TargetComponent={TargetComp} />;
  };
};
