const express = require('express');
const cors = require('cors');
const fs = require('fs');
const config = require('./env.json');
var watson = require('watson-developer-cloud');
var vcapServices = require('vcap_services');


const app = express();
app.use(cors());

var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');   
var text_to_speech = new TextToSpeechV1 ({
    "username": "313cbbc7-62b8-473d-9077-b434fbdb3321",
    "password": "dXS0sicWLO6A"
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


app.listen(3000, function() {
    console.log("Speech server started on port 3000");
});



