import React, { useState, useEffect } from 'react';
import NestedListChild from './NestedListChild';

function NestedList(props) {
    let data = [];
    if(Array.isArray(props.data)) {
        data = {
            id: null,
            children: [...props.data]
        }
    } else {
        data = {...props.data};
        data.children = Array.isArray(props.data.children) ? [...props.data.children] : [];
    }

    // keep the expanded state of the children nodes
    const [childrenExpanded, setChildrenExpanded] = useState(data.children.map(() => 'none')); // 'all', 'some', 'none'
    // keep the summed up expanded state of this node
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
        const nextExpanded = data.children.map((child, index) => {
            if(child.id === id) {
                return newStatus;
            } else if(childrenExpanded[index]) {
                return childrenExpanded[index];
            } else {
                return forceExpand;
            }
        });
        setChildrenExpanded(nextExpanded);
        const nextSummedExpanded = getSummedExpandedStatus(nextExpanded);
        if(nextSummedExpanded !== summedExpanded) {
            setSummedExpanded(nextSummedExpanded);
        }
        if(forceExpand !== 'some') {
            setForceExpand('some');
        }
    }

    let buttonExpand = null;
    switch(summedExpanded){
        case 'all':
            buttonExpand = <button onClick={() => {
                setForceExpand('none');
                setChildrenExpanded(data.children.map(subData => 'none'));
                setSummedExpanded('none');
            }}>Colapse all</button>;
            break;
        case 'none':
            buttonExpand = <button disabled>Expand all</button>;
            break;
        case 'some':
            buttonExpand = <button onClick={() => {
                setForceExpand('all');
                setChildrenExpanded(data.children.map(subData => 'all'));
                setSummedExpanded('all');
            }}>Expand all</button>;
            break;
    }

    let nestedList = null;
    nestedList = data.children.map(subData => {
        if(!subData.children) {
            subData.children = [];
        }
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
            {/* {summedExpanded} - [{childrenExpanded.map(e => e + ' ')}] */}
            <br/>
            {nestedList}
        </>
    );
}

export default NestedList;