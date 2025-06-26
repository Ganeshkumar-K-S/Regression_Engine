import React, { useState } from 'react';
import DropFiles from '../components/DropFiles';
import DragDropWrapper from '../components/DragDropWrapper';
import NullHandling from '../components/NullHandling';
import BuildModel from '../components/BuildModel';
import Assumptions from '../components/Assumptions';
import ModelInference from '../components/ModelInference';
import PredictionForm from '../components/PredictionForm';
import GenerateReport from '../components/GenerateReport';

export default function HomePage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadUUID, setUploadUUID] = useState(null);
  const [attributes, setAttributes] = useState({});
  const [features, setFeatures] = useState([]);
  const [target, setTarget] = useState(null);
  const [targetError, setTargetError] = useState('');
  const [nullAttributes, setNullAttributes] = useState({});
  const [startClicked, setStartClicked] = useState(false);
  const [nullTreated, setNullTreated] = useState(false);
  const [apiDone, setApiDone] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(false);
  const [assumptionDone, setAssumptionDone] = useState(false);
  const [inferenceDone, setInferenceDone] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6">
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
        nullTreated={nullTreated}
        setNullTreated={setNullTreated}
        setStartClicked={setStartClicked}
      />

      {Object.keys(attributes).length > 0 &&
        Object.keys(nullAttributes).length > 0 &&
        Object.keys(nullAttributes).length !== 0 && (
          <NullHandling
            nullAttributes={Object.entries(nullAttributes)}
            attributes={attributes}
            nullTreated={nullTreated}
            setNullTreated={setNullTreated}
          />
        )}

      {Object.keys(attributes).length > 0 &&
        ((Object.keys(nullAttributes).length === 0 && startClicked) || nullTreated) && (
          <BuildModel
            apiDone={apiDone}
            setApiDone={setApiDone}
            accuracy={accuracy}
            setAccuracy={setAccuracy}
            completedSteps={completedSteps}
            setCompletedSteps={setCompletedSteps}
          />
        )}

      {Object.keys(attributes).length > 0 &&
        ((Object.keys(nullAttributes).length === 0 && startClicked) || nullTreated) &&
        accuracy !== 0 &&
        completedSteps && (
          <Assumptions 
            uuid={uploadUUID} 
            features={features} 
            assumptionDone={assumptionDone} 
            setAssumptionDone={setAssumptionDone}
          />
        )}

      {Object.keys(attributes).length > 0 &&
        ((Object.keys(nullAttributes).length === 0 && startClicked) || nullTreated) &&
        accuracy !== 0 &&
        completedSteps &&
        assumptionDone && (
          <ModelInference 
            target={target} 
            inferenceDone={inferenceDone} 
            setInferenceDone={setInferenceDone}
          />
        )}

      {Object.keys(attributes).length > 0 &&
        ((Object.keys(nullAttributes).length === 0 && startClicked) || nullTreated) &&
        accuracy !== 0 &&
        completedSteps &&
        assumptionDone &&
        inferenceDone && (
          <PredictionForm 
            attributes={attributes} 
            features={Object.values(features)} 
            target={target} 
          />
        )}

      {Object.keys(attributes).length > 0 &&
        ((Object.keys(nullAttributes).length === 0 && startClicked) || nullTreated) &&
        accuracy !== 0 &&
        completedSteps &&
        assumptionDone &&
        inferenceDone && (
          <GenerateReport />
        )}
    </div>
  );
}