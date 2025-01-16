import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import API_ENDPOINTS from '../property';

const AppList = ({ setSelectedApp }) => {
  const [apps, setApps] = useState([]);
  const [selectedApp, setAppSelection] = useState(null);
  const [newAppName, setNewAppName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [appLength, setAppLength]=useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchApps = async () => {
      const url = API_ENDPOINTS.GET_ALL_APPS(page, size);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching apps');
        const data = await response.json();
        setApps(data.content);
        setAppLength(apps.length);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching apps:', error);
      }
    };
    fetchApps();
  }, [appLength,page, size]);

  const handleClick = (app) => {
    setSelectedApp(app);
    setAppSelection(app);
  };

  const handleDelete = async (appId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this app?');
    if (!confirmDelete) return;
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_APP(appId), {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete app');
      setApps((prevApps) => prevApps.filter((app) => app.id !== appId));
      setAppLength(apps.length);
    } catch (error) {
      console.error('Error deleting app:', error);
    }
  };

  const handleAddNewApp = async () => {
    if (!newAppName.trim()) {
      alert('App name cannot be empty');
      return;
    }

    const newApp = {
      name: newAppName,
      desc: `${newAppName} app`,
    };

    try {
      const response = await fetch(API_ENDPOINTS.CREATE_APP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApp),
      });
      if (!response.ok) throw new Error('Failed to add app');
      const createdApp = await response.json();
      setPage(totalPages - 1); // Go to the last page
      setApps((prevApps) => [...prevApps, createdApp]);
      setAppLength(apps.length);
      setNewAppName('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding app:', error);
    }
  };

  const handleCancel = () => {
    setNewAppName('');
    setIsAdding(false);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: '10px' }}>
      <h2>Apps</h2>
      {apps.length > 0 ? (
        apps.map((app) => (
          <div
            key={app.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '5px',
              backgroundColor: selectedApp && selectedApp.id === app.id ? '#d3d3d3' : 'transparent',
              border: '1px solid #ccc',
              marginBottom: '5px',
              cursor: 'pointer',
            }}
          >
            <span onClick={() => handleClick(app)}>{app.name}</span>
            <FontAwesomeIcon
              icon={faTrash}
              style={{
                color: 'red',
                cursor: 'pointer',
                marginLeft: '10px',
              }}
              onClick={() => handleDelete(app.id)}
            />
          </div>
        ))
      ) : (
        <p>Loading apps...</p>
      )}

      {/* Pagination Controls */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={handlePreviousPage}
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
