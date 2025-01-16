import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import API_ENDPOINTS from '../property';

const FeatureList = ({ selectedApp, selectedFeature, setSelectedFeature }) => {
  const [features, setFeatures] = useState([]);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [isAdding, setIsAdding] = useState(false); // Track if the user is adding a feature
  const [page, setPage] = useState(0); // Current page
  const [size] = useState(8); // Page size
  const [totalPages, setTotalPages] = useState(0); // Total pages

  useEffect(() => {
    if (selectedApp) {
      const url = API_ENDPOINTS.GET_ALL_FEATURES_BY_APP(selectedApp.id, page, size);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setFeatures(data.content || []); // Assuming API returns { content, totalPages }
          setTotalPages(data.totalPages || 0);
        })
        .catch((error) => console.error('Error fetching features:', error));
    }
  }, [selectedApp, page, size]);

  const handleClick = (feature) => {
    setSelectedFeature(feature);
  };
  const handleDelete = async (featureId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this feature?');
    if (!confirmDelete) return;
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_FEATURE(featureId), {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete feature');
      setFeatures((prevFeatures) => prevFeatures.filter((feature) => feature.id !== featureId));
  
    } catch (error) {
      console.error('Error deleting features:', error);
    }
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
        // Go to the last page
        setPage(totalPages-1); 
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

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((prevPage) => prevPage - 1);
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
               
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                <span onClick={() => handleClick(feature)}>{feature.name}</span>
                           <FontAwesomeIcon
                             icon={faTrash}
                             style={{
                               color: 'red',
                               cursor: 'pointer',
                               marginLeft: '10px',
                             }}
                             onClick={() => handleDelete(feature.id)}
                           />
              </div>
            ))
          ) : (
            <p>No features found</p>
          )}

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={handlePrevPage}
                disabled={page === 0}
                style={{
                  padding: '5px 10px',
                  cursor: page === 0 ? 'not-allowed' : 'pointer',
                  backgroundColor: page === 0 ? '#ccc' : '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Previous
              </button>
              <span>
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages - 1}
                style={{
                  padding: '5px 10px',
                  cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer',
                  backgroundColor: page === totalPages - 1 ? '#ccc' : '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Next
              </button>
            </div>
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
