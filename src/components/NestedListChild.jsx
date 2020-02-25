import React, { useState, useEffect, useCallback } from 'react';
import './NestedListChild.css';

const hasChildren = node => node.children && Array.isArray(node.children) && node.children.length ? true : false;
const initChildrenExpanded = data => {
    if(hasChildren(data)) {
        return data.children.map((child) => hasChildren(child) ? 'none' : 'all');
    } else {
        return ['all'];
    }
};
const initSummedExpanded = (data, forceExpand) => {
    if(!hasChildren(data)) {
        return 'all';
    } else if(forceExpand === 'all') {
        return 'all';
    } else {
        return'none';
    }
};

const calculateSummedExpandedStatus = (data, status) => {
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

const NestedListChild = props => {
    const [nodeExpanded, setNodeExpanded] = useState(props.forceExpand === 'all' ? true : false);
    const [childrenExpanded, setChildrenExpanded] = useState(initChildrenExpanded(props.data)); // 'all', 'some', 'none'
    const [summedExpanded, setSummedExpanded] = useState(initSummedExpanded(props.data, props.forceExpand));
   
    const getSummedExpandedStatus = useCallback((status) => {
        return calculateSummedExpandedStatus(props.data, status);
    }, [props.data]);

    // callback to be used by the child components to report their summedExpanded state to this component
    const reportExpanded = useCallback((id, newStatus) => {
        const nextExpanded = props.data.children.map((child, index) => child.id === id ? newStatus : childrenExpanded[index]);
        setChildrenExpanded(nextExpanded);

        const nextSummedExpanded = nodeExpanded ? calculateSummedExpandedStatus(props.data, nextExpanded) : 'none';
        if(nextSummedExpanded !== summedExpanded) {
            setSummedExpanded(nextSummedExpanded);
        } 
    }, [props.data, nodeExpanded, childrenExpanded, summedExpanded]);

    // on change to the summedExpanded state, report the new state to the parent component
    useEffect(() => {
        props.reportExpanded(props.data.id, summedExpanded);
    }, [props.data.id, summedExpanded]);  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        switch(props.forceExpand) {
            case 'all':
                setNodeExpanded(true);
                setChildrenExpanded(c => c.map(() => 'all'));
                setSummedExpanded('all');
                break;
            case 'none':
                setNodeExpanded(false);
                setChildrenExpanded(c => c.map(() => 'none'));
                setSummedExpanded('none');
                break;
            case 'some':
                break;
            default:
                throw new Error('props.forceExpand has an invalid state: ' + props.forceExpand);
        }
    }, [props.forceExpand]);

    const onButtonExpand = () => {
        setNodeExpanded(true);
        let nextExpanded = ['all'];
        if(Array.isArray(props.data.children)) {
            nextExpanded = props.data.children.map(child => {
                return (child.children && Array.isArray(child.children) && child.children.length) ? 'none' : 'all';
            });
        }
        setChildrenExpanded(nextExpanded);
        const nextSummedExpanded = calculateSummedExpandedStatus(props.data, nextExpanded);
        if(nextSummedExpanded !== summedExpanded){
            setSummedExpanded(nextSummedExpanded);
        }
    }

    const onButtonColapse = () => {
        setNodeExpanded(false);
        setSummedExpanded('none');
    }

    let children = null;
    let button = null;
    if(props.data.children.length !== 0) {
        if(props.forceExpand === 'all' || (nodeExpanded && props.forceExpand !== 'none')) {
            children = props.data.children.map(childData => {
                childData.children = childData.children ? childData.children : [];
                return <NestedListChild
                    key={childData.id} 
                    data={childData} 
                    forceExpand={props.forceExpand}
                    getSummedExpandedStatus={getSummedExpandedStatus}
                    reportExpanded={reportExpanded}/>;
            });

            button = <button className="marginButton" onClick={onButtonColapse}>-</button>;
        } else {
            button = <button className="marginButton" onClick={onButtonExpand}>+</button>;
        }
    }

    return (
        <>
            <div>
                {button}<span className="marginLabel">{props.data.text}</span>
            </div>
            <br/>
            <div className="marginNested">
                {children}
            </div>
        </>
    );
}

export default NestedListChild;