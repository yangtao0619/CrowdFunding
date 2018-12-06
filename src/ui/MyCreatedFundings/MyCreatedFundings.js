//所有当前用户创建的合约展示界面
import React, {Component} from 'react';
import {createRequest, getAllFundings, getAllRequestInfos, payForRequest} from '../../eth/interactions'
import CardList from "../common/CardList";
import CreateFundingForm from './CreateFundingForm'
import {Button, Dimmer, Form, Label, Loader, Segment} from 'semantic-ui-react'
import RequestTable from '../common/RequestTable'

class MyCreatedFundings extends Component {

    constructor() {
        super();
        this.state = {
            active: false,
            loadingCards: false,
            info: '我创建的',
            myCreatedFundings: [],
            currentFunding: '',
            requests: [],
            funding: ''
        }
    }

    async componentWillMount() {
        this.setState({
            loadingCards: true
        });
        //在页面即将加载的时候，获取当前用户创建的所有合约信息
        try {
            let myCreatedFundings = await getAllFundings(1);
            this.setState({
                myCreatedFundings,
                loadingCards: false
            });
        } catch (e) {
            this.setState({
                loadingCards: false
            });
        }
    }

    //点击卡片的时候，获取当前的funding信息
    onCardClick = (currentFunding) => {
        let {funding} = currentFunding;
        console.log('currentFunding.investorCount', currentFunding.investorCount);
        this.setState({
            currentFunding,
            funding
        });
    };

    //处理提交表单的函数,即创建一个请求
    handleCreateRequest = async () => {
        this.setState({
            active: true
        });
        try {
            let {currentFunding, requestDesc, requestAddress, requestBalance} = this.state;
            let {funding} = currentFunding;
            console.log('创建请求：', funding, requestDesc, requestAddress, requestBalance);
            await createRequest(funding, requestDesc, requestAddress, requestBalance);
            this.setState({
                active: false
            });
        } catch (e) {
            this.setState({
                active: false
            });
        }
    };

    //表单数据发生变化的时候触发的方法，需要在这里设置状态.第一个参数e必须保留
    handleChange = (e, {name, value}) => {
        //中括号也一定要带上
        this.setState({[name]: value});
    };

    //显示当前合约下面所有的请求
    handleShowRequests = async () => {
        let requests = await getAllRequestInfos(this.state.funding);
        this.setState({
            requests
        });
    };

    //处理支付的函数
    handleFinalize = async (index) => {
        console.log('进行支付');
        //支付要调用对应的支付接口
        this.setState({
            active: true
        });
        try {
            let {funding} = this.state;
            await payForRequest(index, funding);
            this.setState({
                active: false
            });
        } catch (e) {
            this.setState({
                active: false
            });
        }
    };

    render() {
        let {myCreatedFundings, currentFunding, active, requests} = this.state;
        console.log('currentFunding', currentFunding);
        return (<div><Dimmer.Dimmable as={Segment} dimmed={this.state.loadingCards}>
            <Dimmer active={this.state.loadingCards}>
                <Loader size='massive' active={this.state.loadingCards}>Loading</Loader>
            </Dimmer>
            <CardList details={myCreatedFundings} onCardClick={this.onCardClick}/>
            <CreateFundingForm/>
            {
                <div>
                    <h3>发起付款请求</h3>
                    <Dimmer.Dimmable as={Segment} dimmed={active}>
                        <Dimmer active={active} inverted>
                            <Loader>Loading</Loader>
                        </Dimmer>
                        <Segment>
                            <h4>当前项目:{currentFunding.projectName}, 地址: {currentFunding.funding}</h4>
                            <Form onSubmit={this.handleCreateRequest}>
                                <Form.Input type='text' name='requestDesc'
                                            label='请求描述' placeholder='请求描述' onChange={this.handleChange}/>

                                <Form.Input type='text' name='requestBalance'
                                            label='付款金额' labelPosition='left' placeholder='付款金额'
                                            onChange={this.handleChange}>
                                    <Label basic>￥</Label>
                                    <input/>
                                </Form.Input>

                                <Form.Input type='text' name='requestAddress'
                                            label='商家收款地址' labelPosition='left' placeholder='商家地址'
                                            onChange={this.handleChange}>
                                    <Label basic><span role='img' aria-label='location'>📍</span></Label>
                                    <input/>
                                </Form.Input>

                                <Form.Button primary content='开始请求'/>
                            </Form>
                        </Segment>
                    </Dimmer.Dimmable>
                </div>
            }
            {
                currentFunding && (<div>
                    <Button onClick={this.handleShowRequests}>申请详情</Button>
                    <RequestTable requests={requests}
                                  handleFinalize={this.handleFinalize}
                                  pageKey={2}
                                  investorCount={currentFunding.investorCount}
                    />
                </div>)
            }
        </Dimmer.Dimmable>
        </div>)
    }

}

export default MyCreatedFundings;