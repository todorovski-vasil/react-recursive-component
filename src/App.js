import React, { useState, useEffect } from 'react';
import './App.css';
import NestedList from './components/NestedList';

function App() {
    // let expanded, setExpanded;

    let data = [
        {
        id: 115123425,
        text: "element1",
        children: [{
            id: 115345425,
            text: "subelement1.1",
            children: [{
                id: 1151343225,
                text: "subelement1.1.1"
                }, {
                id: 2351343225,
                text: "subelement1.1.2"
                }
            ]
            }, {
            id: 5855843225,
            text: "subelement1.2"
            }
        ]
        }, {
        id: 17651343225,
        text: "element2",
        children: [{
            id: 1151343125,
            text: "subelement2.1"
            }, {
            id: 1155256262,
            text: "subelement2.2",
            children: [{
                id: 1151378225,
                text: "subelement2.2.1"
                }, {
                id: 1151093225,
                text: "subelement2.2.2",
                children: [{
                    id: 1151378226,
                    text: "subelement2.2.2.1"
                }, {
                    id: 1151093227,
                    text: "subelement2.2.2.2"
                }
                ]
                }
            ]
            }
        ]
        }
    ];

    function forceExpanded() {

    }

    let nestedList = null;
    let dataChildren = [];
    if(Array.isArray(data)) {
        dataChildren = data;
    } else {
        data.children = data.children ? data.children : [];    
        dataChildren = data.children;
    }

    const [expanded, setExpanded] = useState(dataChildren.map(subData => 'all')); // 'some', 'none'
    const [allExpanded, setAllExpanded] = useState('all'); 

    nestedList = dataChildren.map(subData => {
        subData.children = subData.children ? subData.children : [];
        return <NestedList key={subData.id} data={subData} forceExpanded={forceExpanded} setExpanded={(childId, expandedChildren) => {
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

export default App;
