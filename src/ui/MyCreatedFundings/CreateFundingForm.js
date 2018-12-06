import React, {Component} from 'react'
import {Dimmer, Form, Label, Loader, Segment} from 'semantic-ui-react'
import {createFunding} from '../../eth/interactions'

class CreateFundingForm extends Component {

    state = {
        active: false,
        projectName: '',
        supportMoney: '',
        targetMoney: '',
        duration: ''
    };

    //处理创建众筹合约的方法
    handleCreate = async () => {
        //将各个状态从state中解构出来
        this.setState({active: true});
        try {
            let {projectName, supportMoney, targetMoney, duration} = this.state;
            console.log('创建众筹开始', projectName, supportMoney, targetMoney, duration);
            let result = await createFunding(projectName, targetMoney, supportMoney, duration);
            //注意这里如果要获得返回值的话，createFunding的参数需要有resolve进行处理
            console.log('创建众筹完毕');
            this.setState({active: false});
        } catch (e) {
            this.setState({active: false});
        }
    };

    //表单数据发生变化的时候触发的方法，需要在这里设置状态.第一个参数e必须保留
    handleChange = (e, {name, value}) => {
        //中括号也一定要带上
        this.setState({[name]: value});
    };

    render() {
        let {active} = this.state;

        return (<div>
            <Dimmer.Dimmable as={Segment} dimmed={active}>
                <Dimmer active={active} inverted>
                    <Loader>Loading</Loader>
                </Dimmer>
                <Form onSubmit={this.handleCreate}>
                    <Form.Input required type='text' placeholder='项目名称' name='projectName'
                                label='项目名称:'
                                onChange={this.handleChange}/>

                    <Form.Input required type='text' placeholder='支持金额' name='supportMoney'
                                label='支持金额:'
                                labelPosition='left'
                                onChange={this.handleChange}>
                        <Label basic>￥</Label>
                        <input/>
                    </Form.Input>

                    <Form.Input required type='text' placeholder='目标金额' name='targetMoney'
                                label='目标金额:'
                                labelPosition='left'
                                onChange={this.handleChange}>
                        <Label basic>￥</Label>
                        <input/>
                    </Form.Input>
                    <Form.Input required type='text' placeholder='众筹时间' name='duration'
                                label='众筹时间:'
                                labelPosition='left'
                                onChange={this.handleChange}>
                        <Label basic>S</Label>
                        <input/>
                    </Form.Input>
                    <Form.Button primary content='创建众筹'/>
                </Form>
            </Dimmer.Dimmable>
        </div>)
    }
}

export default CreateFundingForm;