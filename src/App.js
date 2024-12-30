// App.js
import React, { useState } from 'react';
import Header from './components/Header';
import AppList from './components/AppList';
import FeatureList from './components/FeatureList';
import ConfigList from './components/ConfigList';
import ReleaseList from './components/ReleaseList';

const App = () => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
// Handler for setting selected app
const handleSetSelectedApp = (app) => {
  setSelectedApp(app); // Update the selected app
  setSelectedFeature(null); // Reset the feature list
  setSelectedConfig(null); // Reset the config and release components
};
// Handler for setting selected feature
const handleSetSelectedFeature = (feature) => {
  setSelectedFeature(feature); // Update the selected feature
  setSelectedConfig(null); // Reset the config and release components
};
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <AppList setSelectedApp={handleSetSelectedApp} setSelectedFeature={setSelectedFeature} />
        <FeatureList   selectedApp={selectedApp}
          selectedFeature={selectedFeature}
          setSelectedFeature={handleSetSelectedFeature} // Use the updated handler
          setSelectedConfig={setSelectedConfig} />
        <ConfigList selectedFeature={selectedFeature} setSelectedConfig={setSelectedConfig} />
        <ReleaseList selectedConfig={selectedConfig} />
      </div>
    </div>
  );
};

export default App;
