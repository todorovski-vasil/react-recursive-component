import React, { useState, useEffect } from 'react';
import './NestedListChild.css';

function NestedListChild(props) {
    const hasChildren = (node) => node.children && Array.isArray(node.children) && node.children.length ? true : false;
    const [nodeExpanded, setNodeExpanded] = useState(props.forceExpand === 'all' ? true : false);
    const [childrenExpanded, setChildrenExpanded] = useState(hasChildren(props.data) ? props.data.children.map((child) => {
        return hasChildren(child) ? 'none' : 'all';
    }) : ['all']); // 'all', 'some', 'none'
    const [summedExpanded, setSummedExpanded] = useState(!hasChildren(props.data) ? 'all' : props.forceExpand === 'all' ? 'all' : 'none');

    const reportExpanded = (id, newStatus) => {
        const nextExpanded = props.data.children.map((child, index) => child.id === id ? newStatus : childrenExpanded[index]);
        setChildrenExpanded(nextExpanded);
        const nextSummedExpanded = nodeExpanded ? props.getSummedExpandedStatus(nextExpanded) : 'none';
        if(nextSummedExpanded !== summedExpanded) {
            setSummedExpanded(nextSummedExpanded);
        }        
    }

    useEffect(() => {
        if(props.forceExpand !== 'all') {
            props.reportExpanded(props.data.id, hasChildren(props.data) ? 'none' : 'all');
        } else {
            props.reportExpanded(props.data.id, 'all');
        }
        return () => props.reportExpanded(props.data.id, 'none')
    }, []);

    useEffect(() => {
        if(props.forceExpand !== 'all') {
            props.reportExpanded(props.data.id, summedExpanded);
        }
    }, [summedExpanded]);

    useEffect(() => {
        switch(props.forceExpand) {
            case 'all':
                setNodeExpanded(true);
                setChildrenExpanded(childrenExpanded.map(() => 'all'));
                setSummedExpanded('all');
                props.reportExpanded(props.data.id, 'all');
                break;
            case 'none':
                setNodeExpanded(false);
                setChildrenExpanded(childrenExpanded.map(() => 'none'));
                setSummedExpanded('none');
                props.reportExpanded(props.data.id, 'none');
                break;
            case 'some':
                break;
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
        const nextSummedExpanded = props.getSummedExpandedStatus(nextExpanded);
        if(nextSummedExpanded !== summedExpanded){
            setSummedExpanded(nextSummedExpanded);
        }
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
                    getSummedExpandedStatus={props.getSummedExpandedStatus}
                    reportExpanded={reportExpanded}/>;
            });

            button = <button className="marginButton" onClick={() => {
                setNodeExpanded(false);
                setSummedExpanded('none');
            }}>-</button>;
        } else {
            button = <button className="marginButton" onClick={onButtonExpand}>+</button>;
        }
    }

    return (
        <>
            <div>
                {button}<span className="marginLabel">{props.data.text}</span>
                {/* {" " + summedExpanded} */}
                {/* {"---"}{childrenExpanded} */}
            </div>
            <br/>
            <div className="marginNested">
                {children}
            </div>
        </>
    );
}

export default NestedListChild;