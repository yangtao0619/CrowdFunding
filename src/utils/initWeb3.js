//导出web3实例
let Web3 = require('web3');
let web3 = new Web3();

web3.setProvider(window.web3.currentProvider);

module.exports = web3;