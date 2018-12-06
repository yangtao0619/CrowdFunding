//所有与合约进行的交互在这里进行

import {NewFundingInstance} from "./instance";

let web3 = require('../utils/initWeb3');

let instances = require('./instance');

//获取平台上所有创建的众筹合约
const getAllFundings = async (index) => {
    //根据index判断请求来自哪个tab
    let fundings;
    let accounts = await  web3.eth.getAccounts();
    let currentAccount = accounts[0];
    if (index == 1) {//我发起的
        fundings = await instances.factoryInstance.methods.getFundingsByAddres().call({
            from: currentAccount
        });
    } else if (index == 2) {//所有的
        fundings = await instances.factoryInstance.methods.getAllFundingsOnPlatfrom().call({
            from: currentAccount
        });
    } else {//我参与的
        fundings = await instances.factoryInstance.methods.getInvestedFundingsByAddresss().call({
            from: currentAccount
        });
    }

    return new Promise(async (resolve, reject) => {
        try {
            console.table(fundings);
            //遍历createdFundings，获取所有合约的详情
            let fundingsDeatils = [];
            for (let i = 0; i < fundings.length; i++) {
                let funding = fundings[i];
                let details = await getAllFundingDetails(funding, i);
                fundingsDeatils.push(details);
            }
            console.table(fundingsDeatils);
            //将数据传给调用者
            resolve(fundingsDeatils);
        } catch (e) {
            reject(e);
        }
    });
};

//实际创建众筹合约的函数,首先需要得到工厂的实例，要发起的众筹信息
const createFunding = async (projectName, targetMoney, everyMoney, duration) => {
    let accounts = await  web3.eth.getAccounts();
    let currentAccount = accounts[0];
    return new Promise(async (resolve, reject) => {
        try {
            let result = await instances.factoryInstance.methods.createNewFunding(projectName, targetMoney, everyMoney, duration).send({
                from: currentAccount
            });
            resolve(result);
            window.location.reload(true);
        } catch (e) {
            reject(e);
            window.location.reload(true);
        }
    });
};

//批准花费请求
const approveSpent = async (funding, index) => {
    let accounts = await  web3.eth.getAccounts();
    let currentAccount = accounts[0];

    return new Promise(async (resolve, reject) => {
        try {
            let fundingInstance = instances.NewFundingInstance();
            fundingInstance.options.address = funding;
            let result = await fundingInstance.methods.approve(index).send({
                from: currentAccount
            });
            resolve(result);
            window.location.reload(true);
        } catch (e) {
            reject(e);
            window.location.reload(true);

        }
    });
};

//创建请求的函数,要得到fundingInstance实例
const createRequest = async (funding, goodsName, receiver, cost) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fundingInstance = instances.NewFundingInstance();
            fundingInstance.options.address = funding;
            let accounts = await web3.eth.getAccounts();
            let currentAccount = accounts[0];
            let result = await fundingInstance.methods.request(goodsName, receiver, cost).send({
                from: currentAccount
            });
            resolve(result);
            window.location.reload(true);
        } catch (e) {
            reject(e);
            window.location.reload(true);
        }
    });
};


//获取所有合约的详情,参数是一个合约，传入的时候将其实例化
const getAllFundingDetails = (funding, index) => {
    return new Promise(async (resolve, reject) => {
        try {
            //这里面需要得到每一个众筹项目的详情
            //给合约地址赋值
            let fundingInstance = instances.NewFundingInstance();
            fundingInstance.options.address = funding;
            //调用合约的方法，获取想要的数据  剩余时间
            let leftTime = await fundingInstance.methods.getLeftTime().call();
            let projectName = await fundingInstance.methods.projectName().call();
            let manager = await fundingInstance.methods.manager().call();
            let targetMoney = await fundingInstance.methods.targetMoney().call();
            let everyMoney = await fundingInstance.methods.everyMoney().call();
            let balance = await fundingInstance.methods.getBalance().call();
            let investorCount = await fundingInstance.methods.getAllInvestors().call();
            //组装一下，返回一个元组.不能返回复杂类型
            console.log(funding, leftTime, projectName, manager, targetMoney, everyMoney, balance, investorCount);
            let detail = {
                index,
                funding,
                leftTime,
                projectName,
                manager,
                targetMoney,
                everyMoney,
                balance,
                investorCount
            };
            resolve(detail);
        } catch (e) {
            reject(e);
        }

    });
};

//提交表单的操作，应该得到这个合约的实例，进行参与调用 invest 函数即可
const handleInvest = (fundingAddress, everyMoney) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('参与众筹：');
            //点击的时候还要让整个界面不可用
            let fundingInstance = NewFundingInstance();
            //给合约地址赋值
            fundingInstance.options.address = fundingAddress;
            //使用这个实例调用合约对应的方法

            let accounts = await web3.eth.getAccounts();

            //参与众筹
            let res = await fundingInstance.methods.invest().send({
                from: accounts[0],
                value: everyMoney
            });
            resolve(res);
            window.location.reload(true);
        } catch (e) {
            reject(e);
            window.location.reload(true);
        }
    });


};

//实际获取所有请求信息的函数
const getAllRequestInfos = (fundingAddress) => {
    return new Promise(async (resolve, reject) => {
        try { //通过合约地址实例化合约，然后通过合约调用方法得到所有的请求信息
            let newInstance = NewFundingInstance();
            newInstance.options.address = fundingAddress;
            let accounts = await web3.eth.getAccounts();
            let requestCounts = await newInstance.methods.getAllRequetsCount().call({
                from: accounts[0]
            });
            let infos = [];
            for (let i = 0; i < requestCounts; i++) {
                let info = await newInstance.methods.getRequetInfos(i).call({
                    from: accounts[0]
                });
                infos.push(info);
            }
            console.log('infos', infos);
            resolve(infos);
        } catch (e) {
            reject(e);
        }

    });
};

//进行支付
const payForRequest = (index, fundingAddress) => {
    return new Promise(async (resolve, reject) => {
        //获取实例
        try {
            let newInstance = NewFundingInstance();
            newInstance.options.address = fundingAddress;
            let accounts = await web3.eth.getAccounts();
            let result = await newInstance.methods.finshRequest(index).send({
                from: accounts[0]
            });
            resolve(result);
            window.location.reload(true);
        } catch (e) {
            reject(e);
            window.location.reload(true);
        }
    });

};

export {
    getAllFundings,
    getAllFundingDetails,
    handleInvest,
    createFunding,
    createRequest,
    getAllRequestInfos,
    payForRequest,
    approveSpent
}
