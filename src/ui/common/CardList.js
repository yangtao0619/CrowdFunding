//每个tab的公共部分，用于展示所有的众筹信息
import React from 'react'
import {Card, Image, List, Progress} from 'semantic-ui-react'

const src = '/images/wireframe/white-image.png';
const CardGroup = (props) => {
    let details = props.details;
    let onCardClick = props.onCardClick;
    console.table(details);

    let cards = details.map(detail => {
        return <CardFunding
            key={detail.index}
            image={src}
            detail={detail}
            onCardClick={onCardClick}/>;
    });

    return (
        //props应该传来一个funding集合，集合每个元素都包含了funding的详细信息。还有一个点击事件。每个tab的点击事件不一样
        <Card.Group itemsPerRow={4}>
            {cards}
        </Card.Group>
    )
};

const CardFunding = (props) => {
    let currentDetail = props.detail;
    let {leftTime, projectName, targetMoney, balance, investorCount} = currentDetail;
    let percentage = parseFloat(balance) / parseFloat(targetMoney) * 100;
    let onCardClick = props.onCardClick;
    return (
        //将详细信息传入函数内
        <Card onClick={() => {
            onCardClick(currentDetail)
        }}>
            <Image src='/imgs/home_avatar.jpg'/>
            <Card.Content>
                <Card.Header>{projectName}</Card.Header>
                <Card.Meta>
                    <span className='date'>剩余时间:{leftTime}</span>
                    <Progress percent={percentage} progress size='small'/>
                </Card.Meta>
                <Card.Description>用过的都说好!</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <List horizontal style={{display: 'flex', justifyContent: 'space-around'}}>
                    <List.Item>
                        <List.Content>
                            <List.Header>已筹</List.Header>
                            {balance} wei
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <List.Header>已达</List.Header>
                            {percentage}%
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <List.Header>参与人数</List.Header>
                            {investorCount}
                        </List.Content>
                    </List.Item>
                </List>
            </Card.Content>
        </Card>
    )
};

export default CardGroup
