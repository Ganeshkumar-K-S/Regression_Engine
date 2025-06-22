import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DropFiles from './components/DropFiles';
import DragDropWrapper from './components/DragDropWrapper';

import './index.css';
import NullHandling from './components/NullHandling';

export default function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadUUID, setUploadUUID] = useState(null);
  const [attributes, setAttributes] = useState({});
  const [features, setFeatures] = useState([]);
  const [target, setTarget] = useState(null);
  const [targetError, setTargetError] = useState('');
  const [nullAttributes, setNullAttributes] = useState({});

  useEffect(() => {
    const clearCache = () => {
      const blob = new Blob([], { type: 'application/json' });
      navigator.sendBeacon('http://localhost:5000/api/clearcache', blob);
    };

    const handleBeforeUnload = (e) => {
      // Only clear cache if still on localhost and not navigating away
      if (window.location.hostname === 'localhost') {
        clearCache();
      }
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
        nullAttributes={nullAttributes}
        setNullAttributes={setNullAttributes}
      />
      {Object.keys(attributes).length > 0 && Object.keys(nullAttributes).length > 0 && (
        <NullHandling
          nullAttributes={Object.entries(nullAttributes)}
          attributes={attributes}
        />
      )}
    </div>
  );
}