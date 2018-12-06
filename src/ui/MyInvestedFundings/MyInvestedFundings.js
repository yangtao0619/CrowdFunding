//所有的合约展示界面
import React, {Component} from 'react';
import CardList from "../common/CardList";
import {approveSpent, getAllFundings, getAllRequestInfos} from "../../eth/interactions";
import {Button, Dimmer, Loader, Segment} from "semantic-ui-react";
import RequestTable from "../common/RequestTable";

class MyInvestedFundings extends Component {
// 0x66cf5551ea30854ef9287234405e241df6f370be
    constructor() {
        super();
        this.state = {
            loadingCards: false,
            info: '我参与的',
            allFundings: [],
            currentDetail: '',
            requests: []
        }
    }

    async componentWillMount() {
        //得到所有当前地址创建的众筹合约
        this.setState({
            loadingCards: true
        });
        try {
            let allFundings = await getAllFundings(3);
            console.log('my invested:', allFundings);
            this.setState({
                loadingCards: false,
                allFundings
            });
        } catch (e) {
            this.setState({
                loadingCards: false
            });
        }

    }

    onCardClick = async (currentFunding) => {
        let {funding} = currentFunding;
        console.log('currentFunding.investorCount', currentFunding.investorCount);
        this.setState({
            currentFunding,
            funding
        });
    };

    handleShowRequests = async () => {
        let requests = await getAllRequestInfos(this.state.funding);
        this.setState({
            requests
        });
    };

//批准花费请求
    handleApprove = async (index) => {
        this.setState({
            active: true
        });
        try {
            let {funding} = this.state;
            await approveSpent(funding, index);
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
        let {allFundings, currentFunding, requests, active} = this.state;

        return <div>
            <Dimmer.Dimmable as={Segment} dimmed={this.state.loadingCards}>
                <Dimmer active={this.state.loadingCards}>
                    <Loader size='mini' active={this.state.loadingCards}>Loading</Loader>
                </Dimmer>
                <CardList details={allFundings} onCardClick={this.onCardClick}/>
                {<Dimmer.Dimmable as={Segment} dimmed={active}>
                    <Dimmer active={active} inverted>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    {
                        currentFunding && (
                            <div>
                                <Button onClick={this.handleShowRequests}>申请详情</Button>
                                <RequestTable requests={requests}
                                              handleApprove={this.handleApprove}
                                              pageKey={3}
                                              investorCount={currentFunding.investorCount}
                                />
                            </div>
                        )
                    }
                </Dimmer.Dimmable>

                }
            </Dimmer.Dimmable>
        </div>
    }
}

export default MyInvestedFundings;