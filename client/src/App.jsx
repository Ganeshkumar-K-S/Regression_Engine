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

 
  // Clear cache on initial load (via fetch DELETE)
  useEffect(() => {
    fetch('http://localhost:5000/api/clearcache', {
      method: 'DELETE',
      credentials: 'include',
    }).catch((err) => console.error('Cache clear error:', err));
  }, []);

  // Clear cache on page unload (via POST sendBeacon)
  useEffect(() => {
    const handleUnload = () => {
      const blob = new Blob([], { type: 'application/json' });
      navigator.sendBeacon('http://localhost:5000/api/clearcache');
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleUnload();
      }
    });

    window.addEventListener('unload', handleUnload);
    return () => {
      window.removeEventListener('unload', handleUnload);
      document.removeEventListener('visibilitychange', handleUnload);
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
