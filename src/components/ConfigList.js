import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import API_ENDPOINTS from "../property";

const ConfigList = ({ selectedApp,selectedFeature,selectedConfig, setSelectedConfig }) => {
  const [configs, setConfigs] = useState([]); // List of current configs
  const [newConfigName, setNewConfigName] = useState(""); // New config name
  const [newConfigQuery, setNewConfigQuery] = useState(""); // New config query
  const [isAdding, setIsAdding] = useState(false); // Toggle for add form
  const [page, setPage] = useState(0); // Current page
  const [size] = useState(8); // Page size
  const [totalPages, setTotalPages] = useState(0); // Total pages

  useEffect(() => {
    if (selectedFeature) {
      const url = API_ENDPOINTS.GET_ALL_CONFIGS_BY_FEATURE(selectedFeature.id, page, size);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setConfigs(data.content || []); // Assuming API returns { content, totalPages }
          setTotalPages(data.totalPages || 0);
        })
        .catch((error) => console.error("Error fetching configs:", error));
    }
  }, [selectedFeature, page, size]);

  const handleClick = (config) => {
    setSelectedConfig(config);
  };
  const handleDelete = async (configId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this config?');
    if (!confirmDelete) return;
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_CONFIG(configId), {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete config');
      setConfigs((prevConfigs) => prevConfigs.filter((config) => config.id !== configId));
  
    } catch (error) {
      console.error('Error deleting configs:', error);
    }
  };

  const handleAddNewConfig = () => {
    if (!newConfigName.trim() || !newConfigQuery.trim()) {
      alert("Config name and query cannot be empty");
      return;
    }

    if (!selectedFeature) {
      alert("Please select a feature before adding a config");
      return;
    }

    const newConfig = {
      name: newConfigName,
      desc: `${selectedFeature.name} feature release for ${newConfigName}`,
      configKey: `${selectedApp.name}-${selectedFeature.name}-${newConfigName}`,
      configQuery: newConfigQuery,
      configValues: "",
      featureId: selectedFeature.id,
    };

    fetch(API_ENDPOINTS.CREATE_CONFIG, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newConfig),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add config");
        }
        return response.json();
      })
      .then((createdConfig) => {
        // Reload last page to include new config
        setPage(totalPages - 1);
        setConfigs((prevConfigs) => [...prevConfigs, createdConfig]);
        setNewConfigName(""); // Clear input fields
        setNewConfigQuery("");
        setIsAdding(false); // Exit add mode
      })
      .catch((error) => console.error("Error adding config:", error));
  };

  const handleCancel = () => {
    setNewConfigName("");
    setNewConfigQuery("");
    setIsAdding(false); // Exit add mode
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((prevPage) => prevPage - 1);
  };

  return (
    <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "10px" }}>
      <h2>Configs</h2>
      {selectedFeature ? (
        <>
          {configs.length > 0 ? (
            configs.map((config) => (
              <div
                key={config.id}
               
              
                 style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '5px',
                  backgroundColor:
                    selectedConfig && selectedConfig.id === config.id
                      ? '#d3d3d3'
                      : 'transparent',
                  border: '1px solid #ccc',
                  marginBottom: '5px',
                }}
              >
                  <span onClick={() => handleClick(config)}>{config.name}</span>
                                          <FontAwesomeIcon
                                            icon={faTrash}
                                            style={{
                                              color: 'red',
                                              cursor: 'pointer',
                                              marginLeft: '10px',
                                            }}
                                            onClick={() => handleDelete(config.id)}
                                          />
                             </div>
           
            ))
          ) : (
            <p>No configs found</p>
          )}

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handlePrevPage}
                disabled={page === 0}
                style={{
                  padding: "5px 10px",
                  cursor: page === 0 ? "not-allowed" : "pointer",
                  backgroundColor: page === 0 ? "#ccc" : "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
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
                  padding: "5px 10px",
                  cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
                  backgroundColor: page === totalPages - 1 ? "#ccc" : "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Next
              </button>
            </div>
          )}

          {/* Add New Config Section */}
          <div style={{ marginTop: "20px" }}>
            {isAdding ? (
              <>
                <input
                  type="text"
                  value={newConfigName}
                  onChange={(e) => setNewConfigName(e.target.value)}
                  placeholder="Enter config name"
                  style={{
                    padding: "5px",
                    width: "80%",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <input
                  type="text"
                  value={newConfigQuery}
                  onChange={(e) => setNewConfigQuery(e.target.value)}
                  placeholder="Enter config query"
                  style={{
                    padding: "5px",
                    width: "80%",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <div>
                  <button
                    onClick={handleAddNewConfig}
                    style={{
                      padding: "5px 10px",
                      cursor: "pointer",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      marginRight: "10px",
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{
                      padding: "5px 10px",
                      cursor: "pointer",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
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
                  padding: "5px 10px",
                  cursor: "pointer",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Add New Config
              </button>
            )}
          </div>
        </>
      ) : (
        <p>Select a Feature</p>
      )}
    </div>
  );
};

export default ConfigList;
