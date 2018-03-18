const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');   
    var text_to_speech = new TextToSpeechV1 ({
        username: '7a8d538b-cbc8-417c-bcf8-4d55ee8eefd9',
        password: 'G5CpJP6BH1GG'
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

app.get('/play', (req, res) => {
    var params = {
        text: 'Hello world',
        voice: 'en-US_AllisonVoice',
        accept: 'audio/basic'
    };
      
    // Pipe the synthesized text to a file.
    /* text_to_speech.synthesize(params).on('error', function(error) {
        console.log('Error:', error);
    }).pipe(fs.createWriteStream('hello_world.wav')); */

    text_to_speech.synthesize(params, function(error, speech) {
        if (error)
          console.log('Error:', error);
        else
          console.log(JSON.stringify(speech, null, 2));
      });

})


app.listen(3000, function() {
    console.log("Speech server started on port 3000");
});



