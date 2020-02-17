import React, { useState, useEffect } from 'react';
import NestedListChild from './NestedListChild';

function NestedListHead(props) {

    let nestedList = null;
    let dataChildren = [];
    if(Array.isArray(props.data)) {
        dataChildren = props.data;
    } else {    
        dataChildren = props.data.children ? props.data.children : [];
    }

    const [expanded, setExpanded] = useState(dataChildren.map(subData => 'all')); // 'some', 'none'
    const [allExpanded, setAllExpanded] = useState('all'); 

    function forceExpanded() {
        
    }

    nestedList = dataChildren.map(subData => {
        subData.children = subData.children ? subData.children : [];
        return <NestedListChild key={subData.id} data={subData} forceExpanded={forceExpanded} setExpanded={(childId, expandedChildren) => {
            let expandedChildrenState = [...expanded];
            let exState = dataChildren.reduce((acc, child, childIndex) => {
                if(child.id === childId) {                
                    expandedChildrenState[childIndex] = expandedChildren;                
                }
                if(expandedChildrenState[childIndex] !== acc.sum) {
                    if(expandedChildrenState[childIndex] === 'none') {
                        if(acc.some) {
                            acc.sum = 'some';
                        } else {
                            acc.sum = 'none';
                        }
                    } else if (expandedChildrenState[childIndex] === 'all') {
                        if(acc.sum === 'none') {
                            acc.sum = 'some';
                        }
                    } else if (expandedChildrenState[childIndex] === 'some') {
                        acc.sum = 'some';
                    }
                }
                if(expandedChildrenState[childIndex] !== 'none') {
                    acc.some = true;
                } 
                return acc;
            }, { sum: 'all', some: false });
            setExpanded(expandedChildrenState);
            setAllExpanded(exState.sum);
        }}/>
    });

    return (
        <>
            {allExpanded}-{expanded}
            <br/>
            {nestedList}
        </>
    );
}

export default NestedListHead;