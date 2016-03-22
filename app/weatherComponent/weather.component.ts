import {Component, OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from "angular2/http";
import {WeatherService}     from './weather.service';
import {WeatherData} from './weather.data';

@Component({
    selector: 'weather-app',
    templateUrl: 'app/weatherComponent/weather.component.html',
    styleUrls: [
        'app/weatherComponent/weather.component.css'
    ],
    providers: [
        HTTP_PROVIDERS
        ,WeatherService
    ]
})

export class WeatherComponent implements OnInit {
 
    weather: WeatherData;
    errorMessage: string;

    constructor(private _weather :WeatherService) {
    }

    ngOnInit() { 
        this.getWeather();
    }

    getIcon() {
        if (!this.weather) {
            console.error("Weather is null or undefined");
            return; 
        }

        let iconClass = "wi wi-owm-";
        console.log(JSON.stringify(this.weather.weather[0]));

        return iconClass + this.weather.weather[0].id.toString();
    }

    getWeather(){
        this._weather.getWeatherByCity("Sammamish","us").subscribe(
            weather => this.weather = weather,
            error => this.errorMessage = <any>error);
    }

}