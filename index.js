const express = require('express');
const cors = require('cors');
const fs = require('fs');
const watson = require('watson-developer-cloud');
const vcapServices = require('vcap_services');

const app = express();
app.use(cors());

var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');   
var text_to_speech = new TextToSpeechV1 ({
    "username": process.env.TTS_USERNAME,
    "password": process.env.TTS_PASSWORD
}); 
  
// speech to text token endpoint
var sttAuthService = new watson.AuthorizationV1(
    Object.assign(
        {
            username: process.env.STT_USERNAME,
            password: process.env.STT_PASSWORD
        },
        vcapServices.getCredentials('speech_to_text') // pulls credentials from environment in bluemix, otherwise returns {}
    )
);

app.use('/api/token', function(req, res) {
    sttAuthService.getToken(
        {
            url: watson.SpeechToTextV1.URL
        },
        function(err, token) {
            if (err) {
                console.log('Error retrieving token: ', err);
                res.status(500).send('Error retrieving token');
                return;
            }
            res.send(token);
        }
    );
});
  
app.get('/voices', (req, res) => {
    text_to_speech.listVoices(null, function(error, voices) {
        if (error) {
            console.log('Error:', error);
        } else {
            res.send(JSON.stringify(voices, null, 2));
        }
    });
})

app.get('/play', (req, res, next) => {
    params = {
        text: req.query.text,
        voice: req.query.voice,
        accept: "audio/wav"
    }
    const transcript = text_to_speech.synthesize(params);
    transcript.on('response', (response) => {
        if (req.query.download) {
            response.headers['content-disposition'] = `attachment; filename=transcript.${getFileExtension(req.query.accept)}`;
        }
    });
    transcript.on('error', next);
    transcript.pipe(res);
});


app.listen(process.env.PORT || 3000, function() {
    console.log("Speech server started on port ", process.env.PORT);
});