import React from 'react'
import {Button, Table} from 'semantic-ui-react'


const RequestTable = (props) => {

    //开始组装,props应该包含所有的请求信息，支付和批准函数，已经投资的人数比
    let {requests, pageKey, handleApprove, handleFinalize, investorCount} = props;
    console.log('investorCount:', investorCount);
    let rowContainer = requests.map((request, index) => {
        return <RowInfo
            request={request}
            index={index}
            key={index}
            pageKey={pageKey}
            investorCount={investorCount}
            handleApprove={handleApprove}
            handleFinalize={handleFinalize}
        />
    });

    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>花费描述</Table.HeaderCell>
                    <Table.HeaderCell>花费金额</Table.HeaderCell>
                    <Table.HeaderCell>商家地址</Table.HeaderCell>
                    <Table.HeaderCell>当前赞成人数</Table.HeaderCell>
                    <Table.HeaderCell>当前状态</Table.HeaderCell>
                    <Table.HeaderCell>操作</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {
                    rowContainer
                }
            </Table.Body>
        </Table>
    )
};


//每一行的信息
const RowInfo = (props) => {
    let {request, handleApprove, index, pageKey, handleFinalize, investorCount} = props;
    // let {purpose, cost, seller, approveCount, investorCount, statusInfo} = props;
    let {0: goodsName, 1: receiver, 2: cost, 3: status, 4: invotedNumber} = request;
    let statusInfo = '';
    if (status == 0) {
        statusInfo = 'voting'
    } else if (status == 1) {
        statusInfo = 'approved'
    } else if (status == 2) {
        statusInfo = 'complete'
    }

    let statusInt = parseInt(status);

    return <Table.Row>
        <Table.Cell>{goodsName}</Table.Cell>
        <Table.Cell>{cost}</Table.Cell>
        <Table.Cell>{receiver}</Table.Cell>
        <Table.Cell>{invotedNumber}/{investorCount}</Table.Cell>
        <Table.Cell>{statusInfo}</Table.Cell>
        <Table.Cell>
            {
                (pageKey == 2) ? (
                    status == 0 ? <Button onClick={() => handleFinalize(index)}>支付</Button> :
                        <Button onClick={() => handleFinalize(index)} disabled>支付</Button>
                ) : (
                    status == 0 ? <Button onClick={() => handleApprove(index)}>批准</Button> :
                        <Button onClick={() => handleApprove(index)} disabled>批准</Button>
                )
            }
        </Table.Cell>
    </Table.Row>
};

export default RequestTable;