import React, { useState, useEffect } from 'react';

const AppList = ({ setSelectedApp }) => {
  const [apps, setApps] = useState([]);
  const [selectedApp, setAppSelection] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8081/getAllApps')
      .then((response) => response.json())
      .then((data) => setApps(data))
      .catch((error) => console.error('Error fetching apps:', error));
  }, []);

  const handleClick = (app) => {
    setSelectedApp(app);
    setAppSelection(app);
  };

  return (
    <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: '10px' }}>
      <h2>Apps</h2>
      {apps.length > 0 ? (
        apps.map((app) => (
          <div
            key={app.id}
            onClick={() => handleClick(app)}
            style={{ cursor: 'pointer', padding: '5px' }}
          >
            {app.name}
          </div>
        ))
      ) : (
        <p>Loading apps...</p>
      )}
    </div>
  );
};

export default AppList;