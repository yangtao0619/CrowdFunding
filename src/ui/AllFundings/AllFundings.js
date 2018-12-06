//所有的合约展示界面
import React, {Component} from 'react';
import CardList from "../common/CardList";
import {Dimmer, Form, Label, Loader, Segment} from 'semantic-ui-react'
import {getAllFundings, handleInvest} from "../../eth/interactions";

class AllFundings extends Component {

    constructor() {
        super();
        this.state = {
            active: false,
            loadingCards: false,
            info: '所有的合约',
            allFundings: [],
            projectName: '',
            funding: '',
            everyMoney: '',
            currentFunding: null
        }
    }

    //加载所有的合约信息
    async componentWillMount() {
        this.setState({
            loadingCards: true
        });
        try {
            let allFundings = await getAllFundings(2);
            console.log('allFundings:', allFundings);
            this.setState({
                allFundings: allFundings,
                loadingCards: false
            });
        } catch (e) {
            this.setState({
                loadingCards: false
            });
        }

    }

    //点击卡片的时候触发的回调函数,在这里要拿到合约的实例，对界面进行填充
    onCardClick = (currentFunding) => {
        //根据传入的合约详情填充界面
        let {projectName, funding, everyMoney} = currentFunding;
        this.setState({
            projectName,
            funding,
            everyMoney,
            currentFunding
        });

    };

    invest = async () => {
        //设置表单不可用
        this.setState({active: true});

        try {
            await handleInvest(this.state.funding, this.state.everyMoney);
            this.setState({active: false});

        } catch (e) {
            this.setState({active: false});
            console.log(e);
        }
    };


    render() {

        return (
            <div>
                <Dimmer.Dimmable as={Segment} dimmed={this.state.loadingCards}>
                    <Dimmer active={this.state.loadingCards}>
                        <Loader size='massive' active={this.state.loadingCards}>Loading</Loader>
                    </Dimmer>

                    <CardList details={this.state.allFundings} onCardClick={this.onCardClick}/>
                    <div style={{marginTop: 10, marginLeft: 10}}>
                        <h3>参与众筹</h3>
                        <Dimmer.Dimmable as={Segment} dimmed={this.state.active}>
                            <Dimmer active={this.state.active} inverted>
                                <Loader>参与中</Loader>
                            </Dimmer>
                            <Form onSubmit={this.invest}>
                                <Form.Input type='text' value={this.state.projectName || ''} label='项目名称:'/>
                                <Form.Input type='text' value={this.state.funding || ''} label='项目地址:'/>
                                <Form.Input type='text' value={this.state.everyMoney || ''} label='支持金额:'
                                            labelPosition='left'>
                                    <Label basic>￥</Label>
                                    <input/>
                                </Form.Input>

                                <Form.Button primary content='参与众筹'/>
                            </Form>
                        </Dimmer.Dimmable>
                    </div>
                </Dimmer.Dimmable>
            </div>)
    }


}

export default AllFundings;