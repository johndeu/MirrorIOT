System.register(['angular2/core', "angular2/http", './weather.service'], function(exports_1, context_1) {
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
    var core_1, http_1, weather_service_1;
    var WeatherComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (weather_service_1_1) {
                weather_service_1 = weather_service_1_1;
            }],
        execute: function() {
            WeatherComponent = (function () {
                function WeatherComponent(_weather) {
                    this._weather = _weather;
                }
                WeatherComponent.prototype.ngOnInit = function () {
                    this.getWeather();
                };
                WeatherComponent.prototype.getIcon = function () {
                    if (!this.weather) {
                        console.error("Weather is null or undefined");
                        return;
                    }
                    var iconClass = "wi wi-owm-";
                    console.log(JSON.stringify(this.weather.weather[0]));
                    return iconClass + this.weather.weather[0].id.toString();
                };
                WeatherComponent.prototype.getWeather = function () {
                    var _this = this;
                    this._weather.getWeatherByCity("Sammamish", "us").subscribe(function (weather) { return _this.weather = weather; }, function (error) { return _this.errorMessage = error; });
                };
                WeatherComponent = __decorate([
                    core_1.Component({
                        selector: 'weather-app',
                        templateUrl: 'app/weatherComponent/weather.component.html',
                        styleUrls: [
                            'app/weatherComponent/weather.component.css'
                        ],
                        providers: [
                            http_1.HTTP_PROVIDERS,
                            weather_service_1.WeatherService
                        ]
                    }), 
                    __metadata('design:paramtypes', [weather_service_1.WeatherService])
                ], WeatherComponent);
                return WeatherComponent;
            }());
            exports_1("WeatherComponent", WeatherComponent);
        }
    }
});
