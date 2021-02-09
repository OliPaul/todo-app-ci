const fs = require('fs');
const T2SConfig = require('./ibm_t2s_config.json');

const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const { response } = require('express');

module.exports = {
    authenticate: function () {

        const textToSpeech = new TextToSpeechV1({
            authenticator: new IamAuthenticator({
                apikey: T2SConfig.apikey,
            }),
            serviceUrl: T2SConfig.url,
        });

        return textToSpeech;
    },
    voiceSynthetization: async function(text) {

        const textToSpeech = this.authenticate();
        const synthesizeParams = {
            text: text,
            accept: 'audio/wav',
            voice: 'fr-FR_ReneeV3Voice',
        };

        const response = await textToSpeech.synthesize(synthesizeParams)
        const buffer = await textToSpeech.repairWavHeaderStream(response.result);
        //Save file
        fs.writeFileSync("result.wav", buffer);

        const binaryFile = fs.readFileSync("result.wav");

        return binaryFile.toString("base64");
    }
}
