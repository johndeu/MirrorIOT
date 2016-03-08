/// <reference path="../../typings/amplifyjs/amplifyjs.d.ts" />
import {Injectable, EventEmitter, Input, Output} from "angular2/core";

@Injectable()
export class SpeechService {

    @Output() onSpeaking: EventEmitter<string>;
    @Output() onSpeechStateChanged: EventEmitter<string>;
    @Output() onSpeechError: EventEmitter<string>;
    @Output() onSpeechRecognized: EventEmitter<string>;
    @Output() onSpeechNotRecognized: EventEmitter<string>;

    constructor() {

        this.onSpeaking = new EventEmitter();
        this.onSpeechStateChanged = new EventEmitter();
        this.onSpeechError = new EventEmitter();
        this.onSpeechRecognized = new EventEmitter();
        this.onSpeechNotRecognized = new EventEmitter();

        // HACK: This was the only way i could figure out how to Pub/Sub to the events on the WinJS speech Recognizer. 
        // Using it in the this service directly was not resolving the callbacks, so i have kept the core speech recognition engine running in 
        // js/speechrecognizer.js.    I am using Amplifyjs core for the pub/sub feature.  Amplifyjs is loaded in the index.html page and added to 
        // the Window object.  I am using the amplifyjs typings file in this service to enable the amplifyStatic interface typings for subscribe. 
        if (typeof (window.amplify) != "undefined") {

            let amp: amplifyStatic = window.amplify;

            // Subscribe to the Speaking topic on Amplifyjs. Event is published from speechRecognizer.js
            // the "this" is the context for the callback, otherwise it will be undefined in speaking method and i cant' use this.onSpeaking.emit(data)
            amp.subscribe("Speaking", this, this.speaking);
            // SpeechStateChanged
            amp.subscribe("SpeechStateChanged", this, this.speechStateChanged);
            //  SpeechUnsuccessful
            amp.subscribe("SpeechUnsuccessful", this, this.speechError);
            // SpeechRecognized_High
            amp.subscribe("SpeechRecognized_High", this, this.speechRecognized);
            // SpeechRecognized_Low      
            amp.subscribe("SpeechRecognized_Low", this, this.speechNotRecognized);
        }


    }

    speaking(data: string) {
        console.log("Speech.Service:: Speaking data:" + data);
        this.onSpeaking.emit(data);
    }

    speechStateChanged(state: string) {
        console.log("Speech.Service:: Speech State changed to : " + state);
        this.onSpeechStateChanged.emit(state);
    }

    speechError(error: string) {
        console.log("Speech.Service:: Speech Error : " + error);
        this.onSpeechError.emit(error);
    }


    speechRecognized(tag: string) {
        console.log("Speech.Service:: Speech Recognized with tag : " + tag);
        this.onSpeechRecognized.emit(tag);
    }

    speechNotRecognized(tag: string) {
        console.log("Speech.Service:: Speech was Not Recognized,  with tag : " + tag);
        this.onSpeechNotRecognized.emit(tag);
    }

    say(speechString: string) {
        if (typeof (Windows) != "undefined") {

            let synth = Windows.Media.SpeechSynthesis.SpeechSynthesizer();

            let audio = new Audio(); //creating an audio object


            console.log("Speaking the phrase: " + speechString);



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
    }


};