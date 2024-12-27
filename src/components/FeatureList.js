import React, { useState, useEffect } from 'react';

const FeatureList = ({ selectedApp, setSelectedFeature }) => {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    if (selectedApp) {
      fetch(`http://localhost:8081/getAllFeaturesByApp/${selectedApp.id}`)
        .then((response) => response.json())
        .then((data) => setFeatures(data))
        .catch((error) => console.error('Error fetching features:', error));
    }
  }, [selectedApp]);

  const handleClick = (feature) => {
    setSelectedFeature(feature);
  };

  return (
    <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: '10px' }}>
      <h2>Features</h2>
      {selectedApp ? (
        features.length > 0 ? (
          features.map((feature) => (
            <div
              key={feature.id}
              onClick={() => handleClick(feature)}
              style={{ cursor: 'pointer', padding: '5px' }}
            >
              {feature.name}
            </div>
          ))
        ) : (
          <p>Loading features...</p>
        )
      ) : (
        <p>Select an App</p>
      )}
    </div>
  );
};

export default FeatureList;
