import React, { useEffect,useState } from "react";

const ConfigList = ({ selectedFeature, setSelectedConfig }) => {
  const [configs, setConfigs] = useState([]);

  useEffect(() => {
    if (selectedFeature) {
      fetch(`http://localhost:8081/getAllConfigsByFeature/${selectedFeature.id}`)
        .then((response) => response.json())
        .then((data) => setConfigs(data))
        .catch((error) => console.error('Error fetching configs:', error));
    }
  }, [selectedFeature]);

 
  const [selectedConfig, setConfigSelection] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    desc: "",
    configName: "",
    configKey: "",
    configValue: "",
  });

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

    if (!selectedFeature || !selectedFeature.id) {
      alert("No feature selected. Please select a feature first.");
      return;
    }

    const featureId = selectedFeature.id; // Assuming `selectedFeature` has an `id` field

    fetch(`http://localhost:8081/createConfig?featureId=${featureId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to create config");
        }
      })
      .then((newConfig) => {
        // Add the new config to the list
        setConfigs((prev) => [...prev, newConfig]);
        setShowForm(false); // Close the form after submission
        setFormData({
          desc: "",
          configName: "",
          configKey: "",
          configValue: "",
        });
      })
      .catch((error) => console.error("Error creating config:", error));
  };

  return (
    <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "10px" }}>
      <h2>Configs</h2>
      {selectedFeature ? (
        <>
          {configs
            .filter((config) => !selectedConfig || config.configName === selectedConfig.configName)
            .map((config, index) => (
              <div
                key={config.id || index}
                onClick={() => handleClick(config)}
                style={{ cursor: "pointer", padding: "5px" }}
              >
                {config.configName} {/* Render the configName property */}
              </div>
            ))}
          <button onClick={toggleForm} style={{ marginTop: "10px" }}>
            {showForm ? "Cancel" : "Add Config"}
          </button>
          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
              <div>
                <label>
                  Description:
                  <input
                    type="text"
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Config Name:
                  <input
                    type="text"
                    name="configName"
                    value={formData.configName}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Config Key:
                  <input
                    type="text"
                    name="configKey"
                    value={formData.configKey}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Config Value:
                  <input
                    type="text"
                    name="configValue"
                    value={formData.configValue}
                    onChange={handleChange}
                    required
                  />
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
