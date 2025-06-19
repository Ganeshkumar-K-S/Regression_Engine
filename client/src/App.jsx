import React from 'react';
import Header from './components/Header';
import './index.css';
import DropFiles from './components/DropFiles';

export default function App() {
  return (
    <div className='bg-honeydew'>
      <Header/>
      <DropFiles />
    </div>
  );
}
