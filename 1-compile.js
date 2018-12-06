//导入sol编译器
let solc = require('solc');

let fs = require('fs');

//读取合约内容
let data = fs.readFileSync('./contracts/FundingFactory.sol','utf-8');

//solc进行编译
let output = solc.compile(data,1);
console.log('output is ',output);

//导出
module.exports = output['contracts'][':FundingFactory'];