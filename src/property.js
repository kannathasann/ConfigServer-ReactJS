const API_ENDPOINTS={
    CREATE_APP: 'http://localhost:8081/createApp',
    GET_ALL_APPS: 'http://localhost:8081/getAllApps',
    CREATE_FEATURE: 'http://localhost:8081/createFeature',
    GET_ALL_FEATURES_BY_APP:(appId)=>
        `http://localhost:8081/getAllFeaturesByApp/${appId}`,
    GET_ALL_CONFIGS_BY_FEATURE: (featureId)=>
        `http://localhost:8081/getAllConfigsByFeature/${featureId}`,
  
    CREATE_CONFIG: 'http://localhost:8081/createConfig',
    GET_ALL_RELEASE_BY_CONFIG:(configKey, configQuery)=>
     `http://localhost:8081/getAllReleaseByConfig?configkey=${configKey}&configQuery=${configQuery}`,
    UPDATE_CONFIG:(configKey,featureId)=>
        `http://localhost:8081/updateConfig?configKey=${configKey}&featureId=${featureId}`
  
}

export default API_ENDPOINTS


