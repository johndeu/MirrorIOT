System.register(["angular2/core", "./speechService/speech.service"], function(exports_1, context_1) {
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
    var core_1, speech_service_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (speech_service_1_1) {
                speech_service_1 = speech_service_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(_speechService) {
                    this._speechService = _speechService;
                }
                AppComponent.prototype.ngOnInit = function () {
                    this._speechService.say("Angular 2 Started");
                    this.date = "3/1/2016";
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: "my-app",
                        templateUrl: 'app/app.component.html',
                        directives: [],
                        providers: [
                            speech_service_1.SpeechService
                        ]
                    }), 
                    __metadata('design:paramtypes', [speech_service_1.SpeechService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map