const cloudantConfig = require('./ibm_cloudant_config.json');

const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

module.exports = {
    authenticate: function(){
        const authenticator = new IamAuthenticator({
            apikey: cloudantConfig.apikey
        });
        
        const service = new CloudantV1({
            authenticator: authenticator
        });
        
        service.setServiceUrl(cloudantConfig.url);

        return service;
    }
}
