import React, { useState, useEffect } from 'react';

const FeatureList = ({ selectedApp, selectedFeature, setSelectedFeature }) => {
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
              style={{
                cursor: 'pointer',
                padding: '5px',
                backgroundColor:
                  selectedFeature && selectedFeature.id === feature.id
                    ? '#d3d3d3' // Highlight color for the selected feature
                    : 'transparent', // Default background for unselected features
                border: '1px solid #ccc', // Optional: Add a border for better visibility
                marginBottom: '5px', // Optional: Add spacing between items
              }}
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
