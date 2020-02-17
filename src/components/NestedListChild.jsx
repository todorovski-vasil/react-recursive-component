import React, { useState, useEffect } from 'react';
import './NestedListChild.css';

function NestedListChild(props) {
    const [expanded, setExp] = useState(true);
    const [expandedChildren, setExpChildren] = useState(props.data.children.filter(child => {
            return child.children && child.children.length
        })
        .map(() => 'all'));
    const [parentExp, setParentExp] = useState('all');
    const [forceExpand, setForceExpand] = useState('all');

    let children = null;
    let button = null;

    if(props.data.children.length !== 0) {
        if(expanded) {
            children = props.data.children.map(childData => {
                childData.children = childData.children ? childData.children : [];
                return <NestedListChild key={childData.id} data={childData} forceExpand={forceExpand} setExpanded={(childId, expandedChild) => {
                    let expandedChildrenState = [...expandedChildren];
                    let exState = props.data.children.reduce((acc, child, childIndex) => {
                        if(child.id === childId) {
                            expandedChildrenState[childIndex] = expandedChild;
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
                    setExpChildren(expandedChildrenState);
                    setParentExp(exState.sum);
                }}/>;
            });

            button = <button className="marginButton" onClick={() => {
                setExp(false);
                setExpChildren(expandedChildren.map(() => 'none'));
                setParentExp('none');
            }}>-</button>;
        } else {
            button = <button className="marginButton" onClick={() => {
                setExp(true);
                setExpChildren(expandedChildren.map(() => 'all'));
                setParentExp('all');
            }}>+</button>;
        }
    }

    useEffect(() => {
        props.setExpanded(props.data.id, parentExp);
    }, [parentExp]);

    useEffect(() => {
        switch(props.forceExpand) {
            case 'all':
                setExp(true);
                setExpChildren(expandedChildren.map(() => 'all'));
                setParentExp('all');
                break;
            case 'none':
                setExp(false);
                setExpChildren(expandedChildren.map(() => 'none'));
                setParentExp('none');
                break;
            case 'some':
                break;
        }
        setForceExpand(props.forceExpand);
    }, [props.forceExpand]);

    return (
        <>
            <div>
                {button}<span className="marginLabel">{props.data.text}</span>
                {/* {"---"}{expandedChildren} */}
            </div>
            <br/>
            <div className="marginNested">
                {children}
            </div>
        </>
    );
}

export default NestedListChild;