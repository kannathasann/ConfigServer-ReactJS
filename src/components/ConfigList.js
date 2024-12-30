import React, { useEffect, useState } from "react";

const ConfigList = ({ selectedFeature, setSelectedConfig }) => {
  const [configs, setConfigs] = useState([]); // List of current configs
  const [selectedConfig, setConfigSelection] = useState(null); // Selected config
  const [predefinedConfigNames, setPredefinedConfigNames] = useState([]); // Predefined config names
  const [showForm, setShowForm] = useState(false); // Form visibility toggle
  const [formData, setFormData] = useState({
    configName: "",
  });

  // Fetch predefined config names from the server
  useEffect(() => {
    fetch("http://localhost:8081/config/predefinedNames")
      .then((response) => response.json())
      .then((data) => setPredefinedConfigNames(data))
      .catch((error) =>
        console.error("Error fetching predefined config names:", error)
      );
  }, []);

  // Fetch all configs for the selected feature
  useEffect(() => {
    if (selectedFeature) {
      setShowForm(false); 
      fetch(`http://localhost:8081/getAllConfigsByFeature/${selectedFeature.id}`)
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

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFeature || !selectedFeature.name) {
      alert("No feature selected. Please select a feature first.");
      return;
    }

    // Build request body dynamically based on selected configName
    const requestBody = {
      desc: `${selectedFeature.name} feature release based on ${formData.configName}`,
      configName: formData.configName,
      configKey: `${selectedFeature.name}Enabled${formData.configName}`,
      configValue: "",
    };

    fetch(`http://localhost:8081/createConfig?featureId=${selectedFeature.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Expect the API to return the updated list of configs
        } else {
          throw new Error("Failed to create config");
        }
      })
      .then((updatedConfigs) => {
        setConfigs(updatedConfigs); // Update the state with the entire list of configurations
        setShowForm(false); // Close the form after submission
        setFormData({
          configName: "",
        });
      })
      .catch((error) => console.error("Error creating config:", error));
  };

  // Filter predefined config names to exclude already used config names
  const availableConfigNames = predefinedConfigNames.filter(
    (name) => !configs.some((config) => config.configName === name)
  );

  return (
    <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "10px" }}>
      <h2>Configs</h2>
      {selectedFeature ? (
        <>
          {configs.map((config, index) => (
            <div
              key={config.id || index}
              onClick={() => handleClick(config)}
              style={{
                cursor: "pointer",
                padding: "5px",
                backgroundColor:
                  selectedConfig &&
                  selectedConfig.configName === config.configName
                    ? "#d3d3d3"
                    : "transparent",
                border: "1px solid #ccc",
                marginBottom: "5px",
              }}
            >
              {config.configName}
            </div>
          ))}
          <button onClick={toggleForm} style={{ marginTop: "10px" }}>
            {showForm ? "Cancel" : "Add Config"}
          </button>
          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
              <div>
                <label>
                  Config Name:
                  <select
                    name="configName"
                    value={formData.configName}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select Config Name
                    </option>
                    {availableConfigNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button type="submit" style={{ marginTop: "10px" }}>
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
