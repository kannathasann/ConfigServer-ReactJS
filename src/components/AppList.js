import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../property';

const AppList = ({ setSelectedApp }) => {
  const [apps, setApps] = useState([]);
  const [selectedApp, setAppSelection] = useState(null);
  const [newAppName, setNewAppName] = useState('');
  const [isAdding, setIsAdding] = useState(false); // Track if user is in "add mode"

  useEffect(() => {
    const url = API_ENDPOINTS.GET_ALL_APPS;
    fetch(url)
      .then((response) => response.json())
      .then((data) => setApps(data))
      .catch((error) => console.error('Error fetching apps:', error));
  }, []);

  const handleClick = (app) => {
    setSelectedApp(app);
    setAppSelection(app);
  };

  const handleAddNewApp = () => {
    if (!newAppName.trim()) {
      alert('App name cannot be empty');
      return;
    }

    const newApp = {
      name: newAppName,
      desc: `${newAppName} app`,
    };

    fetch(API_ENDPOINTS.CREATE_APP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newApp),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add app');
        }
        return response.json();
      })
      .then((createdApp) => {
        setApps((prevApps) => [...prevApps, createdApp]);
        setNewAppName(''); // Clear input
        setIsAdding(false); // Exit "add mode"
      })
      .catch((error) => console.error('Error adding app:', error));
  };

  const handleCancel = () => {
    setNewAppName(''); // Clear input
    setIsAdding(false); // Exit "add mode"
  };

  return (
    <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: '10px' }}>
      <h2>Apps</h2>
      {apps.length > 0 ? (
        apps.map((app) => (
          <div
            key={app.id}
            onClick={() => handleClick(app)}
            style={{
              cursor: 'pointer',
              padding: '5px',
              backgroundColor: selectedApp && selectedApp.id === app.id ? '#d3d3d3' : 'transparent',
              border: '1px solid #ccc',
              marginBottom: '5px',
            }}
          >
            {app.name}
          </div>
        ))
      ) : (
        <p>Loading apps...</p>
      )}

      {/* Add New App Section */}
      <div style={{ marginTop: '20px' }}>
        {isAdding ? (
          <>
            <input
              type="text"
              value={newAppName}
              onChange={(e) => setNewAppName(e.target.value)}
              placeholder="Enter app name"
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
                onClick={handleAddNewApp}
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
            Add New App
          </button>
        )}
      </div>
    </div>
  );
};

export default AppList;
