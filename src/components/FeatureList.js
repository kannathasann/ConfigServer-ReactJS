import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../property';

const FeatureList = ({ selectedApp, selectedFeature, setSelectedFeature }) => {
  const [features, setFeatures] = useState([]);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [isAdding, setIsAdding] = useState(false); // Track if the user is adding a feature

  useEffect(() => {
    if (selectedApp) {
      const url = API_ENDPOINTS.GET_ALL_FEATURES_BY_APP(selectedApp.id);
      fetch(url)
        .then((response) => response.json())
        .then((data) => setFeatures(data))
        .catch((error) => console.error('Error fetching features:', error));
    }
  }, [selectedApp]);

  const handleClick = (feature) => {
    setSelectedFeature(feature);
  };

  const handleAddNewFeature = () => {
    if (!newFeatureName.trim()) {
      alert('Feature name cannot be empty');
      return;
    }

    if (!selectedApp) {
      alert('Please select an app before adding a feature');
      return;
    }

    const newFeature = {
      name: newFeatureName,
      desc: `${newFeatureName} feature`,
      featureKey: `${selectedApp.name}-${newFeatureName}`,
      appId: selectedApp.id,
    };

    fetch(API_ENDPOINTS.CREATE_FEATURE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFeature),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add feature');
        }
        return response.json();
      })
      .then((createdFeature) => {
        setFeatures((prevFeatures) => [...prevFeatures, createdFeature]);
        setNewFeatureName(''); // Clear the input box after adding
        setIsAdding(false); // Exit add mode
      })
      .catch((error) => console.error('Error adding feature:', error));
  };

  const handleCancel = () => {
    setNewFeatureName('');
    setIsAdding(false); // Exit add mode without saving
  };

  return (
    <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: '10px' }}>
      <h2>Features</h2>
      {selectedApp ? (
        <>
          {features.length > 0 ? (
            features.map((feature) => (
              <div
                key={feature.id}
                onClick={() => handleClick(feature)}
                style={{
                  cursor: 'pointer',
                  padding: '5px',
                  backgroundColor:
                    selectedFeature && selectedFeature.id === feature.id
                      ? '#d3d3d3'
                      : 'transparent',
                  border: '1px solid #ccc',
                  marginBottom: '5px',
                }}
              >
                {feature.name}
              </div>
            ))
          ) : (
            <p>No features found</p>
          )}

          {/* Add New Feature Section */}
          <div style={{ marginTop: '20px' }}>
            {isAdding ? (
              <>
                <input
                  type="text"
                  value={newFeatureName}
                  onChange={(e) => setNewFeatureName(e.target.value)}
                  placeholder="Enter feature name"
                  style={{
                    padding: '5px',
                    width: '80%',
                    marginBottom: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
                <div>
                  <button
                    onClick={handleAddNewFeature}
                    style={{
                      padding: '5px 10px',
                      cursor: 'pointer',
                      backgroundColor: '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      marginRight: '10px',
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{
                      padding: '5px 10px',
                      cursor: 'pointer',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                style={{
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Add New Feature
              </button>
            )}
          </div>
        </>
      ) : (
        <p>Select an App</p>
      )}
    </div>
  );
};

export default FeatureList;
