System.register(["angular2/core", "./speechService/speech.service", "./weatherComponent/weather.component", "./emit.service"], function(exports_1, context_1) {
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
    var core_1, speech_service_1, weather_component_1, emit_service_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (speech_service_1_1) {
                speech_service_1 = speech_service_1_1;
            },
            function (weather_component_1_1) {
                weather_component_1 = weather_component_1_1;
            },
            function (emit_service_1_1) {
                emit_service_1 = emit_service_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(_speechService, _emitService) {
                    var _this = this;
                    this._speechService = _speechService;
                    this._emitService = _emitService;
                    this.speakingStatus = "...";
                    this.speechError = "...";
                    this.emitMessage = "...";
                    this._emitService.onEventEmitted.subscribe(function (message) { return _this.onEmit(message); });
                    this._speechService.onSpeaking.subscribe(function (phrase) {
                        _this.onSpeaking(phrase);
                    });
                    this._speechService.onSpeechStateChanged.subscribe(function (state) {
                        _this.onSpeechStateChanged(state);
                    });
                    this._speechService.onSpeechRecognized.subscribe(function (tag) {
                        _this.onRecognized(tag);
                    });
                    this._speechService.onSpeechError.subscribe(function (error) {
                        _this.onSpeechError(error);
                    });
                }
                AppComponent.prototype.onEmit = function (message) {
                    this.emitMessage = message;
                };
                AppComponent.prototype.ngOnInit = function () {
                    this.date = "3/10/2016";
                    this._speechService.say("Here we go!");
                    this.emitMessage = "loading...";
                };
                AppComponent.prototype.ngAfterViewChecked = function () {
                    //console.log("VIEW CHECKED!!!!");
                };
                AppComponent.prototype.ngAfterContentChecked = function () {
                    //console.log("CONTENT CHECKED!!!!");
                };
                AppComponent.prototype.clicked = function () {
                    this.speakingStatus = "clicked";
                    console.log("clicked");
                };
                AppComponent.prototype.onSpeaking = function (text) {
                    console.log("App.Component:: speaking: " + text);
                    this.speakingStatus = text;
                };
                AppComponent.prototype.onRecognized = function (tag) {
                    console.log("App.Component:: recognized: " + tag);
                    this.speakingStatus = tag;
                };
                AppComponent.prototype.onSpeechStateChanged = function (state) {
                    console.log("App.Component: speech state changed: " + state);
                    this.recognitionState = this._speechService.recognitionState;
                };
                AppComponent.prototype.onSpeechError = function (error) {
                    console.error("ERROR: App.Component:  Speech Error: " + error);
                    this.speechError = error;
                    if (this._speechService.recognitionState == speech_service_1.RecognitionState.Error) {
                        this.recognitionState = speech_service_1.RecognitionState.Error;
                    }
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: "my-app",
                        templateUrl: 'app/app.component.html',
                        directives: [weather_component_1.WeatherComponent],
                        providers: [
                            speech_service_1.SpeechService,
                            emit_service_1.EmitMessageService
                        ]
                    }), 
                    __metadata('design:paramtypes', [speech_service_1.SpeechService, emit_service_1.EmitMessageService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
