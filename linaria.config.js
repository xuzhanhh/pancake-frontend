module.exports = {
  rules: [
    {
      action: require('@linaria/shaker').default,
    },
    {
      test: /node_modules[\/\\](?!@(binance|tarojs))/,
      action: 'ignore',
    },
    // {
    //   test: /node_modules[\/\\](?!@tarojs)/,
    //   action: 'ignore',
    // },
    //  {
    //   test: /node_modules[\/\\](?!@binance)/,
    //   action: 'ignore',
    // },
  ],
}
