import React, { useState, useEffect } from 'react';
import NestedListChild from './NestedListChild';

function NestedList(props) {
    let dataChildren = [];  // obsolete, to be replaced by data
    let data = [];
    if(Array.isArray(props.data)) {
        // dataChildren = props.data;
        data = {
            id: null,
            children: [...props.data]
        }
    } else {    
        // dataChildren = props.data.children ? props.data.children : [];
        data = {...props.data};
        data.children = Array.isArray(props.data.children) ? [...props.data.children] : [];
    }

    // const [expanded, setExpanded] = useState(dataChildren.map(() => 'all')); // 'some', 'none'
    // keep the expanded state of the children nodes
    // const [expanded, setExpanded] = useState(data.children.map(() => 'none')); // 'all', 'some', 'none'
    const [childrenExpanded, setChildrenExpanded] = useState(data.children.map(() => 'none')); // 'all', 'some', 'none'
    // keep the summed up expanded state of this node
    // const [allExpanded, setAllExpanded] = useState('all');  // obsolete, to be replaced by summedExpanded
    const [summedExpanded, setSummedExpanded] = useState('none');
    const [forceExpand, setForceExpand] = useState('some');

    const getSummedExpandedStatus = (status) => {
        return data.children.reduce((acc, child, childIndex) => {
            if(status[childIndex] !== acc.sum) {
                if(status[childIndex] === 'none') {
                    if(acc.some) {
                        acc.sum = 'some';
                    } else {
                        acc.sum = 'none';
                    }
                } else if (status[childIndex] === 'all') {
                    if(acc.sum === 'none') {
                        acc.sum = 'some';
                    }
                } else if (status[childIndex] === 'some') {
                    acc.sum = 'some';
                }
            }
            if(status[childIndex] !== 'none') {
                acc.some = true;
            } 
            return acc;
        }, { sum: 'all', some: false }).sum;
    }

    const reportExpanded = (id, newStatus) => {
        const nextExpanded = data.children.map((child, index) => child.id === id ? newStatus : childrenExpanded[index]);
        setChildrenExpanded(nextExpanded);
        setSummedExpanded(getSummedExpandedStatus(nextExpanded));
        setForceExpand('some');
    }

    let buttonExpand = null;
    switch(summedExpanded){
        case 'all':
            buttonExpand = <button onClick={() => {
                setForceExpand('none');
                setChildrenExpanded(dataChildren.map(subData => 'none'));
            }}>Colapse all</button>;
            break;
        case 'none':
            buttonExpand = <button disabled>Expand all</button>;
            break;
        case 'some':
            buttonExpand = <button onClick={() => {
                setForceExpand('all');
                setChildrenExpanded(dataChildren.map(subData => 'all'))
            }}>Expand all</button>;
            break;
    }

    let nestedList = null;
    nestedList = data.children.map(subData => {
        subData.children = subData.children ? subData.children : [];
        return (
            <NestedListChild
                key={subData.id} 
                data={subData} 
                forceExpand={forceExpand}
                getSummedExpandedStatus={getSummedExpandedStatus}
                reportExpanded={reportExpanded}
            />
        );
    });    

    return (
        <>
            {buttonExpand}
            {summedExpanded} - [{childrenExpanded.map(e => e + ' ')}] {/* for debugging only */}
            <br/>
            {nestedList}
        </>
    );
}

export default NestedList;