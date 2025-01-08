import React, { useState, useEffect } from "react";
import API_ENDPOINTS from "../property";

const ReleaseList = ({ selectedFeature, selectedConfig }) => {
  const [releases, setReleases] = useState([]);
  const [updatedReleases, setUpdatedReleases] = useState([]);

  useEffect(() => {
    if (selectedConfig) {
      const url =API_ENDPOINTS.GET_ALL_RELEASE_BY_CONFIG(selectedConfig.configKey, selectedConfig.configQuery);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setReleases(data);
          setUpdatedReleases(
            data.filter((release) => release.status === "enabled").map((r) => r.id)
          );
        })
        .catch((error) => console.error("Error fetching releases:", error));
    } else {
      setReleases([]); // Clear releases if no config is selected
      setUpdatedReleases([]);
    }
  }, [selectedConfig]);

  const toggleStatus = (release) => {
    setReleases((prevReleases) =>
      prevReleases.map((r) =>
        r.id === release.id
          ? { ...r, status: r.status === "enabled" ? "disabled" : "enabled" }
          : r
      )
    );

    setUpdatedReleases((prev) =>
      release.status === "enabled"
        ? prev.filter((id) => id !== release.id) // Remove disabled
        : [...prev, release.id] // Add enabled
    );
  };

  const handleUpdate = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to update the release configurations?"
    );
  
    if (!isConfirmed) {
      return; // If the user cancels, do nothing
    }
    const url = API_ENDPOINTS.UPDATE_CONFIG(selectedConfig.configKey,selectedFeature.id);
    fetch(url,
      {       
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedReleases),
      }
    )
      .then((response) => {
        if (response.ok) {
          alert("Config updated successfully");
        } else {
          alert("Failed to update config");
        }
      })
      .catch((error) => console.error("Error updating config:", error));
  };

  return (
    <div style={{ flex: 1, padding: "10px" }}>
      <h2>Releases</h2>
      {selectedConfig ? (
        releases.length > 0 ? (
          releases.map((release) => (
            <div
              key={release.id}
              style={{
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>{release.name}</span>
              <button
                onClick={() => toggleStatus(release)}
                style={{
                  backgroundColor:
                    release.status === "enabled" ? "green" : "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                {release.status === "enabled" ? "Enabled" : "Disabled"}
              </button>
            </div>
          ))
        ) : (
          <p>no release found</p>
        )
      ) : (
        <p>Select a Config</p>
      )}
      {selectedConfig && (
        <button
          onClick={handleUpdate}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Update
        </button>
      )}
    </div>
  );
};

export default ReleaseList;
