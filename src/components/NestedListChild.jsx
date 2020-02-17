import React, { Component } from 'react';

import './NestedListChild.css';

class NestedListChild extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            expanded: true,
            expandedChildren: props.data.children.filter(child => child.children && child.children.length).map(() => 'all')
        }

        props.setExpanded(props.data.id, 'all');
    }
    
    colapse = () => {
        this.setState({ expanded: false, expandedChildren: this.state.expandedChildren.map(() => 'none') }, () => this.props.setExpanded(this.props.data.id, 'none'));        
    }

    expand = () => {
        this.setState({ expanded: true, expandedChildren: this.state.expandedChildren.map(() => 'all') }, () => this.props.setExpanded(this.props.data.id, 'all'));
    }

    setExpanded = (childId, expandedChildren) => {
        let expandedChildrenState = [...this.state.expandedChildren];
        let exState = this.props.data.children.reduce((acc, child, childIndex) => {
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
        this.setState({
            expandedChildren: expandedChildrenState
        }, () => this.props.setExpanded(this.props.data.id, exState.sum))
    }

    render() {
        let children = null;
        let button = null;
        
        if(this.props.data.children.length !== 0) {
            if(this.state.expanded) {
                children = this.props.data.children.map(childData => {
                    childData.children = childData.children ? childData.children : [];
                    return <NestedListChild key={childData.id} data={childData} setExpanded={this.setExpanded}/>;
                });

                button = <button className="marginButton" onClick={this.colapse}>-</button>;
            } else {
                button = <button className="marginButton" onClick={this.expand}>+</button>;
            }
        }        

        return (
            <>
                <div>
                    {this.props.data.text}{button}{"---"}{this.state.expandedChildren}
                </div>
                <br/>
                <div className="marginNested">
                    {children}
                </div>
            </>
        );
    }
}

export default NestedListChild;