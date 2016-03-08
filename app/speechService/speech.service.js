System.register(["angular2/core"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var SpeechService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            SpeechService = (function () {
                function SpeechService() {
                    this.onSpeaking = new core_1.EventEmitter();
                    this.onSpeechStateChanged = new core_1.EventEmitter();
                    this.onSpeechError = new core_1.EventEmitter();
                    this.onSpeechRecognized = new core_1.EventEmitter();
                    this.onSpeechNotRecognized = new core_1.EventEmitter();
                    // HACK: This was the only way i could figure out how to Pub/Sub to the events on the WinJS speech Recognizer. 
                    // Using it in the this service directly was not resolving the callbacks, so i have kept the core speech recognition engine running in 
                    // js/speechrecognizer.js.    I am using Amplifyjs core for the pub/sub feature.  Amplifyjs is loaded in the index.html page and added to 
                    // the Window object.  I am using the amplifyjs typings file in this service to enable the amplifyStatic interface typings for subscribe. 
                    if (typeof (window.amplify) != "undefined") {
                        var amp = window.amplify;
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
                SpeechService.prototype.speaking = function (data) {
                    console.log("Speech.Service:: Speaking data:" + data);
                    this.onSpeaking.emit(data);
                };
                SpeechService.prototype.speechStateChanged = function (state) {
                    console.log("Speech.Service:: Speech State changed to : " + state);
                    this.onSpeechStateChanged.emit(state);
                };
                SpeechService.prototype.speechError = function (error) {
                    console.log("Speech.Service:: Speech Error : " + error);
                    this.onSpeechError.emit(error);
                };
                SpeechService.prototype.speechRecognized = function (tag) {
                    console.log("Speech.Service:: Speech Recognized with tag : " + tag);
                    this.onSpeechRecognized.emit(tag);
                };
                SpeechService.prototype.speechNotRecognized = function (tag) {
                    console.log("Speech.Service:: Speech was Not Recognized,  with tag : " + tag);
                    this.onSpeechNotRecognized.emit(tag);
                };
                SpeechService.prototype.say = function (speechString) {
                    if (typeof (Windows) != "undefined") {
                        var synth = Windows.Media.SpeechSynthesis.SpeechSynthesizer();
                        var audio_1 = new Audio(); //creating an audio object
                        console.log("Speaking the phrase: " + speechString);
                        // get all voices
                        var allVoices = Windows.Media.SpeechSynthesis.SpeechSynthesizer.allVoices;
                        // Find the right voice for now, just use index 0  - Female is allVoices[n].gender=1 with language "en-US".  displayName = "Microsoft Zira Mobile"
                        var selectedVoice = allVoices[0];
                        // and use that voice, to be set
                        synth.voice = selectedVoice;
                        synth.synthesizeTextToStreamAsync(speechString).then(function (markersStream) {
                            // Convert the stream to a URL Blob.
                            var blob = MSApp.createBlobFromRandomAccessStream(markersStream.ContentType, markersStream);
                            // Send the Blob to the audio object.
                            audio_1.src = URL.createObjectURL(blob, { oneTimeOnly: true });
                            markersStream.seek(0); // start at beginning when speak is hit
                            audio_1.play();
                        });
                    }
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], SpeechService.prototype, "onSpeaking", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], SpeechService.prototype, "onSpeechStateChanged", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], SpeechService.prototype, "onSpeechError", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], SpeechService.prototype, "onSpeechRecognized", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], SpeechService.prototype, "onSpeechNotRecognized", void 0);
                SpeechService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], SpeechService);
                return SpeechService;
            }());
            exports_1("SpeechService", SpeechService);
            ;
        }
    }
});
