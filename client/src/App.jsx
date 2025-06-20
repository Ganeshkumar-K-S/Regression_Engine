import React, { useState } from 'react';
import Header from './components/Header';
import DropFiles from './components/DropFiles';
import './index.css';
import Attributes from './components/Attributes';

export default function App() {
  const [uploadedFile, setUploadedFile] = useState(null);

  return (
    <div className="bg-honeydew-900 min-h-screen">
      <Header />
      <DropFiles uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} />
      <Attributes uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} />
    </div>
  );
}
