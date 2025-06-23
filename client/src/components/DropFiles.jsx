import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import csvIcon from '../assets/csv.png';
import jsonIcon from '../assets/json.png';

const MAX_SIZE_MB = 256;

export default function DropFiles({ uploadedFile, setUploadedFile, uploadUUID, setUploadUUID }) {
  const [error, setError] = useState('');
  const [hasUploaded, setHasUploaded] = useState(!!uploadedFile);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleFileChange = async (e) => {
    const files = e.target.files || e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    if (files.length > 1) {
      setError('Only one file can be uploaded at a time.');
      setUploadedFile(null);
      return;
    }

    const file = files[0];
    const isValidType = file.type === 'application/json' || file.name.endsWith('.csv');
    const isValidSize = file.size <= MAX_SIZE_MB * 1024 * 1024;

    if (!isValidType) {
      setError('Only CSV or JSON files are allowed.');
      setUploadedFile(null);
      return;
    }

    if (!isValidSize) {
      setError('File size exceeds 256MB.');
      setUploadedFile(null);
      return;
    }

    setUploadedFile(file);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/uploads/', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(`Upload failed: ${errorText}`);
        setUploadedFile(null);
      } else {
        const data = await response.json();
        console.log(data.message);
        console.log("UUID:", data.uuid);
        setUploadUUID(data.uuid);
        setHasUploaded(true);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload. Please try again.');
      setUploadedFile(null);
    }
  };

  const removeFile = async () => {
    try {
      await fetch('http://localhost:5000/api/clearcache', { method: 'DELETE', credentials: 'include' });
    } catch (err) {
      console.error('Failed to clear cache:', err);
    }

    setUploadedFile(null);
    setHasUploaded(false);
    setError('');
    setUploadUUID(null);
    document.getElementById('dropzone-file').value = null;
  };

  const getIcon = () => {
    if (!uploadedFile) return null;
    if (uploadedFile.name.endsWith('.csv')) return csvIcon;
    if (uploadedFile.name.endsWith('.json')) return jsonIcon;
    return null;
  };

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col justify-between w-full min-h-[22rem] border-2 rounded-2xl px-6 py-8 transition
            ${hasUploaded ? 'bg-gray-100 cursor-not-allowed border-gray-200'
              : isDragOver ? 'bg-gray-200 hover:bg-gray-100' 
              : 'border-dashed cursor-pointer bg-gray-50 hover:bg-gray-100'}
          `}
          onClick={(e) => hasUploaded && e.preventDefault()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!hasUploaded) setIsDragOver(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            if (!hasUploaded) setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            if (!hasUploaded) setIsDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (!hasUploaded) {
              setIsDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileChange({ target: { files: [file] } });
            }
          }}
        >
          {/* Top Section */}
          <div className="flex flex-col items-center justify-center flex-1">
            {isDragOver ? (
              <svg
                className="w-10 h-10 mb-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v12m0 0l-3.5-3.5M12 16l3.5-3.5M20.25 16.5A3.75 3.75 0 0016.5 12.75H7.5a3.75 3.75 0 00-3.75 3.75v.75A3.75 3.75 0 007.5 21h9a3.75 3.75 0 003.75-3.75v-.75z"
                />
              </svg>
            ) : (
              // Upload icon
              <svg
                className="w-10 h-10 mb-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
            )}

            <p className="mb-2 text-sm text-gray-600">
              {isDragOver
                ? <span className="font-semibold">Drop your file here</span>
                : <><span className="font-semibold">Click to upload</span> or drag and drop</>
              }
            </p>
            <p className="text-xs text-gray-500">CSV or JSON files only (MAX. 256MB)</p>
          </div>

          {/* Bottom Section */}
          <div className="mt-6 space-y-2">
            {uploadedFile && (
              <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border">
                    <img src={getIcon()} alt="icon" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[12rem]">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost cursor-pointer"
                  onClick={removeFile}
                >
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 font-medium text-center">{error}</p>
            )}
          </div>

          <input
            id="dropzone-file"
            type="file"
            accept=".csv,application/json"
            multiple={false}
            className="hidden"
            disabled={hasUploaded}
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
