import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DropFiles from './components/DropFiles';
import Attributes from './components/Attributes';
import './index.css';

export default function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadUUID, setUploadUUID] = useState(null); // 🆕 Pass this around

  // Optional: clear cache on initial load
  useEffect(() => {
    fetch('http://localhost:5000/api/clearcache', {
      method: 'DELETE',
      credentials: 'include',
    }).catch((err) => console.error('Cache clear error:', err));
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
      <Attributes
        uploadedFile={uploadedFile}
        uploadUUID={uploadUUID}
      />
    </div>
  );
}
