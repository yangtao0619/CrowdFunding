let {bytecode, interface} = require('./1-compile');

let Web3 = require('web3');

let HDWalletProvider = require('truffle-hdwallet-provider')

let web3 = new Web3();
// web3.setProvider('http://127.0.0.1:8545');

let netIp = 'https://ropsten.infura.io/v3/f5e8ff7638e145da91db256a9ebb840a';

let terms = 'wage position unit vanish life gallery reflect stem travel mobile student picture';

let provider = new HDWalletProvider(terms,netIp);

web3.setProvider(provider);

let contract = new web3.eth.Contract(JSON.parse(interface));
let deploy = async () => {

    let accounts = await web3.eth.getAccounts();
    console.log('accout are ', accounts);
    let instance = await contract.deploy({
        data: bytecode,
    }).send({
        from: accounts[0],
        gas: '3000000'
    });
    console.log('contract address is ', instance.options.address);
};
deploy();