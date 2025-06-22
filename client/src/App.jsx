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

  // Clear cache only on page refresh or exit
  useEffect(() => {
    const clearCache = () => {
      // Use sendBeacon for reliability during page unload
      const blob = new Blob([], { type: 'application/json' });
      navigator.sendBeacon('http://localhost:5000/api/clearcache', blob);
    };

    const handleBeforeUnload = (e) => {
      // This handles both refresh and window close
      clearCache();
    };

    const handleVisibilityChange = () => {
      // Only clear when page becomes hidden and user is likely leaving
      if (document.visibilityState === 'hidden') {
        clearCache();
      }
    };

    // Listen for page unload events (refresh, close, navigate away)
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Listen for visibility changes (tab switch, minimize, etc.)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup listeners
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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