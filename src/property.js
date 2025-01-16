const API_ENDPOINTS={
    CREATE_APP: 'http://localhost:8081/createApp',
    GET_ALL_APPS: (page, size) => `http://localhost:8081/getAllApps?page=${page}&size=${size}`,
    DELETE_APP:(appId)=>  `http://localhost:8081/deleteApp/${appId}`,


    CREATE_FEATURE: 'http://localhost:8081/createFeature',
    GET_ALL_FEATURES_BY_APP:(appId, page , size)=>
        `http://localhost:8081/getAllFeaturesByApp/${appId}?page=${page}&size=${size}`,
    DELETE_FEATURE:(featureId)=>  `http://localhost:8081/deleteFeature?id=${featureId}`,



    GET_ALL_CONFIGS_BY_FEATURE: (featureId, page, size)=>
        `http://localhost:8081/getAllConfigsByFeature/${featureId}?page=${page}&size=${size}`,
  
    CREATE_CONFIG: 'http://localhost:8081/createConfig',
    GET_ALL_RELEASE_BY_CONFIG:(configKey, configQuery)=>
     `http://localhost:8081/getAllReleaseByConfig?configkey=${configKey}&configQuery=${configQuery}`,
    UPDATE_CONFIG:(configKey,featureId)=>
        `http://localhost:8081/updateConfig?configKey=${configKey}&featureId=${featureId}`,
    DELETE_CONFIG:(configId)=>  ` http://localhost:8081/deleteConfig/${configId}`


   
}

export default API_ENDPOINTS


