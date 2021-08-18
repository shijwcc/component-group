module.exports = {
  extendTemplate: 'external.html',
  webpackMerge: {
    output: {
      libraryExport: '',
    },
    externals: {
      moment: 'moment',
      '@alifd/next': {
        commonjs: '@alifd/next',
        commonjs2: '@alifd/next',
        amd: 'Next',
        root: 'Next',
      },
    },
  },
};
