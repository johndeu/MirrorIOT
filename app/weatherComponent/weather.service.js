System.register(["angular2/http", "angular2/core", "rxjs/Observable"], function(exports_1, context_1) {
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
    var http_1, core_1, Observable_1;
    var WeatherService;
    return {
        setters:[
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            }],
        execute: function() {
            WeatherService = (function () {
                function WeatherService(http) {
                    this.http = http;
                    this._apiKey = 'b354169c5469a6fba90dc32d4e2ec7a7';
                    this._api_ByCity = 'http://api.openweathermap.org/data/2.5/weather?q={CITY},{COUNTRYCODE}&units=imperial&APPID={APIKEY}';
                    this._api_FiveDayByCity = 'http://api.openweathermap.org/data/2.5/forecast?q={CITYNAME},{COUNTRYCODE}&units=imperial&APPID={APIKEY}';
                    this._api_SixteenDayByCity = 'http://api.openweathermap.org/data/2.5/forecast/daily?q={CITYNAME},{COUNTRYCODE}&units=imperial&cnt={DAYS}&APPID={APIKEY}'; //cnt = 1-16
                }
                WeatherService.prototype.getWeatherByCity = function (city, country) {
                    var apiCall = this._api_ByCity
                        .replace('{CITY}', city)
                        .replace('{COUNTRY}', country)
                        .replace('{APIKEY}', this._apiKey);
                    console.log("WeatherService Api:" + apiCall);
                    return this.http.get(apiCall)
                        .do(function (res) { return console.log("WeatherAPI= " + JSON.stringify(res)); })
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                };
                WeatherService.prototype.handleError = function (error) {
                    console.error(error);
                    return Observable_1.Observable.throw(error.json().error || 'Server error');
                };
                WeatherService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], WeatherService);
                return WeatherService;
            }());
            exports_1("WeatherService", WeatherService);
        }
    }
});
