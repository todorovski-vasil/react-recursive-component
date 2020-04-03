import React from 'react';
import './App.css';
import NestedList from './components/NestedList';
import { data } from './utils/generateData';

function App() {
    return <NestedList data={data} />;
}

export default App;
