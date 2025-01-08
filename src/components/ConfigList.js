import React, { useEffect, useState } from "react";
import API_ENDPOINTS from "../property";

const ConfigList = ({ selectedApp, selectedFeature, setSelectedConfig }) => {
  const [configs, setConfigs] = useState([]); // List of current configs
  const [selectedConfig, setConfigSelection] = useState(null); // Selected config
  const [isAdding, setIsAdding] = useState(false); // Add form visibility toggle
  const [formData, setFormData] = useState({
    name: "",
    configQuery: "",
  });

  // Fetch all configs for the selected feature
  useEffect(() => {
    if (selectedFeature) {
      setIsAdding(false);
      const url = API_ENDPOINTS.GET_ALL_CONFIGS_BY_FEATURE(selectedFeature.id);
      fetch(url)
        .then((response) => response.json())
        .then((data) => setConfigs(data))
        .catch((error) => console.error("Error fetching configs:", error));
    } else {
      setConfigs([]); // Clear configs if no feature is selected
    }
  }, [selectedFeature]);

  const handleClick = (config) => {
    setSelectedConfig(config);
    setConfigSelection(config);
  };

  const toggleAddForm = () => {
    setIsAdding(!isAdding);
    setFormData({ name: "", configQuery: "" }); // Clear form data when toggling
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFeature) {
      alert("No feature selected. Please select a feature first.");
      return;
    }

    const requestBody = {
      name: formData.name,
      desc: `${selectedFeature.name} feature release based on ${formData.name} for ${selectedApp.name} application`,
      configKey: `${selectedApp.name}-${selectedFeature.name}-${formData.name}`,
      configQuery: formData.configQuery,
      configValues: "",
      featureId: selectedFeature.id,
    };

    const url = API_ENDPOINTS.CREATE_CONFIG;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create config");
        }
        return response.json();
      })
      .then((createdConfig) => {
        setConfigs(createdConfig); // Append the new config
        setIsAdding(false); // Close the form
        setFormData({ name: "", configQuery: "" }); // Clear form data
      })
      .catch((error) => console.error("Error creating config:", error));
  };

  return (
    <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "10px" }}>
      <h2>Configs</h2>
      {selectedFeature ? (
        <>
          {configs.length > 0 ? (
            configs.map((config, index) => (
              <div
                key={config.id || index}
                onClick={() => handleClick(config)}
                style={{
                  cursor: "pointer",
                  padding: "5px",
                  backgroundColor:
                    selectedConfig && selectedConfig.name === config.name
                      ? "#d3d3d3"
                      : "transparent",
                  border: "1px solid #ccc",
                  marginBottom: "5px",
                }}
              >
                {config.name}
              </div>
            ))
          ) : (
            <p>No configs found</p>
          )}
          <button
            onClick={toggleAddForm}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              backgroundColor: isAdding ? "#dc3545" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isAdding ? "Cancel" : "Add Config"}
          </button>
          {isAdding && (
            <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
              <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Config name"
                    required
                    style={{
                      marginLeft: "10px",
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
              </div>
              <div style={{ marginTop: "10px" }}>
                  <input
                    type="text"
                    name="configQuery"
                    value={formData.configQuery}
                    onChange={handleChange}
                    placeholder="Enter Config Query"
                    required
                    style={{
                      marginLeft: "10px",
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
              </div>
              <button
                type="submit"
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </form>
          )}
        </>
      ) : (
        <p>Select a Feature</p>
      )}
    </div>
  );
};

export default ConfigList;
