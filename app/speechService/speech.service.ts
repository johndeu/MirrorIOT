import {Injectable, EventEmitter, Input, Output} from "angular2/core";

@Injectable()
export class SpeechService{

    @Output() speaking: EventEmitter<boolean>;
    
    constructor() {
          this.speaking = new EventEmitter();
    }
    
    say(speechString:string){   
        if (typeof(Windows) != "undefined") {
            
            let synth = Windows.Media.SpeechSynthesis.SpeechSynthesizer();
    
            let audio = new Audio(); //creating an audio object
            console.log("Speaking the phrase: " + speechString);
                    
            this.speaking.emit(true);
            
            // get all voices
            let allVoices = Windows.Media.SpeechSynthesis.SpeechSynthesizer.allVoices;
            // Find the right voice for now, just use index 0  - Female is allVoices[n].gender=1 with language "en-US".  displayName = "Microsoft Zira Mobile"
            let selectedVoice = allVoices[0];

            // and use that voice, to be set
            synth.voice = selectedVoice;
            synth.synthesizeTextToStreamAsync(speechString).then(function(markersStream) {
                // Convert the stream to a URL Blob.
                let blob = MSApp.createBlobFromRandomAccessStream(markersStream.ContentType, markersStream);

                // Send the Blob to the audio object.
                audio.src = URL.createObjectURL(blob, { oneTimeOnly: true });
                markersStream.seek(0); // start at beginning when speak is hit
       
                audio.play();
              
            });
        }
    }};