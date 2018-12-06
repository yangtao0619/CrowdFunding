import React from 'react'
import {Tab} from 'semantic-ui-react'

import MyCreatedFundings from './MyCreatedFundings/MyCreatedFundings'
import AllFundings from './AllFundings/AllFundings'
import MyInvestedFundings from './MyInvestedFundings/MyInvestedFundings'

const panes = [
    {menuItem: '我发起的', render: () => <Tab.Pane><MyCreatedFundings/></Tab.Pane>},
    {menuItem: '所有的项目', render: () => <Tab.Pane><AllFundings/></Tab.Pane>},
    {menuItem: '我参与的众筹', render: () => <Tab.Pane><MyInvestedFundings/></Tab.Pane>},
];

const TabCenter = () => (
    <Tab menu={{fluid: true, vertical: true, tabular: true}} style={{marginLeft:100}} grid={{
        paneWidth: 12,
        tabWidth: 2
    }} panes={panes} defaultActiveIndex={1}/>
);

export default TabCenter;