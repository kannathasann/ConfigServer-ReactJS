const API_ENDPOINTS={
    GET_ALL_APPS: 'http://localhost:8081/getAllApps',
    GET_ALL_PREDEFINED_CONFIGS:'http://localhost:8081/config/predefinedNames',
    GET_ALL_CONFIGS_BY_FEATURE: (featureId)=>
        `http://localhost:8081/getAllConfigsByFeature/${featureId}`,
    GET_ALL_FEATURES_BY_APP:(appId)=>
        `http://localhost:8081/getAllFeaturesByApp/${appId}`,
    CREATE_CONFIG:(featureId)=>
        `http://localhost:8081/createConfig?featureId=${featureId}`,
    GET_ALL_RELEASE_BY_CONFIG:(configName, configKey)=>
     `http://localhost:8081/getAllReleaseByConfig?name=${configName}&configkey=${configKey}`,
    UPDATE_CONFIG:(configKey,featureId)=>
        `http://localhost:8081/updateConfig?configKey=${configKey}&featureId=${featureId}`
}

export default API_ENDPOINTS


