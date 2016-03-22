import {Http, Response}  from "angular2/http";
import {Injectable} from "angular2/core";
import {Observable} from "rxjs/Observable";
import {WeatherData} from './weather.data';

@Injectable()
export class WeatherService{

   private _apiKey = 'b354169c5469a6fba90dc32d4e2ec7a7';
   private _api_ByCity = 'http://api.openweathermap.org/data/2.5/weather?q={CITY},{COUNTRYCODE}&units=imperial&APPID={APIKEY}';
   private _api_FiveDayByCity = 'http://api.openweathermap.org/data/2.5/forecast?q={CITYNAME},{COUNTRYCODE}&units=imperial&APPID={APIKEY}';
   private _api_SixteenDayByCity = 'http://api.openweathermap.org/data/2.5/forecast/daily?q={CITYNAME},{COUNTRYCODE}&units=imperial&cnt={DAYS}&APPID={APIKEY}' //cnt = 1-16

    constructor(private http: Http) {
    }    
    
    getWeatherByCity(city: string, country:string) {
        let apiCall = this._api_ByCity
            .replace('{CITY}', city)
            .replace('{COUNTRY}', country)
            .replace('{APIKEY}', this._apiKey);
        console.log("WeatherService Api:" + apiCall);

        return this.http.get(apiCall)
            .do(res => console.log("WeatherAPI= "+ JSON.stringify(res) ))
            .map(res => <WeatherData>res.json())
            .catch(this.handleError);
    }

    handleError(error:Response)
    {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
