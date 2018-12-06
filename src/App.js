import React, {Component} from 'react';
import TabCenter from './ui/TabCenter';
import {Header, Icon} from "semantic-ui-react";
/*,
      "web3": "^1.0.0-beta.34"*/
let web3 = require('./utils/initWeb3');

let contract = require('./eth/instance');


class App extends Component {

    constructor() {
        super();
        console.log('create app');

        //必须初始化这个状态变量，否则获得的值为null
        this.state = {
            currentAccount: '',
        }
    }

    async componentWillMount() {
        let accounts = await web3.eth.getAccounts();
        let currentAccount = accounts[0];
        //获取合约平台管理员
        let platformManager = await contract.factoryInstance.methods.platformManager().call();
        this.setState({
            currentAccount: currentAccount,
            platformManager: platformManager
        });
        /* let createdFundings = await getAllFundings();
         console.log('createdFundings');
         console.table(createdFundings);*/


    }


    render() {
        return (
            <div>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='users' circular/>
                    <Header.Content>当前地址：{this.state.currentAccount}</Header.Content>
                    <Header.Content>合约平台管理员：{this.state.platformManager}</Header.Content>
                </Header>
                <TabCenter/>
            </div>
        );
    }
}

export default App;
