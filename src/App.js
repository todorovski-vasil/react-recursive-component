import React from 'react';
import './App.css';
import NestedList from './components/NestedList';

function App() {
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

    return (
        <NestedList data={data}/>
    );
}

export default App;
