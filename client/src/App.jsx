import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DropFiles from './components/DropFiles';
import DragDropWrapper from './components/DragDropWrapper';

import './index.css';

export default function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadUUID, setUploadUUID] = useState(null);
  const [attributes, setAttributes] = useState({});
  const [features, setFeatures] = useState([]);
  const [target, setTarget] = useState(null);
  const [targetError, setTargetError] = useState('');

  useEffect(() => {
    // Only clear cache on beforeunload (most reliable)
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliability during page unload
      navigator.sendBeacon('http://localhost:5000/api/clearcache');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="bg-honeydew-900 min-h-screen">
      <Header />
      <DropFiles
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
        uploadUUID={uploadUUID}
        setUploadUUID={setUploadUUID}
      />
      
      <DragDropWrapper
        uploadedFile={uploadedFile}
        uploadUUID={uploadUUID}
        attributes={attributes}
        setAttributes={setAttributes}
        features={features}
        setFeatures={setFeatures}
        target={target}
        setTarget={setTarget}
        targetError={targetError}
        setTargetError={setTargetError}
      />
    </div>
  );
}