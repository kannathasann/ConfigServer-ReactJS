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

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <AppList setSelectedApp={setSelectedApp} setSelectedFeature={setSelectedFeature} />
        <FeatureList selectedApp={selectedApp}  selectedFeature={selectedFeature} setSelectedFeature={setSelectedFeature} setSelectedConfig={setSelectedConfig} />
        <ConfigList selectedFeature={selectedFeature} setSelectedConfig={setSelectedConfig} />
        <ReleaseList selectedConfig={selectedConfig} />
      </div>
    </div>
  );
};

export default App;
