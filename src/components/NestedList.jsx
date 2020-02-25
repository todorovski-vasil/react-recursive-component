import React, { useState, useCallback } from 'react';
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

    const getSummedExpandedStatus = useCallback((status) => {
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
    }, [data.children]);

    // callback to be used by the child components to report their summedExpanded state to this component
    const reportExpanded = useCallback((id, newStatus) => {
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
        // always reset forceExpand to 'some' after receiving change from a child componenet
        // (this enables the forceExpand prop to act as a sygnal when set to 'all' or 'none', an be ignored right away afterwards)
        if(forceExpand !== 'some') {
            setForceExpand('some');
        }
    }, [data.children, childrenExpanded, summedExpanded, forceExpand, getSummedExpandedStatus]);

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
        default:
            throw new Error('summedExpanded has an invalid state: ' + summedExpanded);
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