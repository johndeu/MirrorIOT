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
                    this.speaking = new core_1.EventEmitter();
                }
                SpeechService.prototype.say = function (speechString) {
                    if (typeof (Windows) != "undefined") {
                        var synth = Windows.Media.SpeechSynthesis.SpeechSynthesizer();
                        var audio_1 = new Audio(); //creating an audio object
                        console.log("Speaking the phrase: " + speechString);
                        this.speaking.emit(true);
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
                ], SpeechService.prototype, "speaking", void 0);
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
//# sourceMappingURL=speech.service.js.map