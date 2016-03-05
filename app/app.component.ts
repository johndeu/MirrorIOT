import {Component, provide, OnInit} from "angular2/core";

import {SpeechService} from "./speechService/speech.service";
import {WeatherComponent} from "./weatherComponent/weather.component";

@Component({
    selector: "my-app",
    templateUrl: 'app/app.component.html',
    directives: [WeatherComponent],
    providers: [
        SpeechService
    ]
})
 
export class AppComponent implements OnInit {
    date: string;

    constructor(private _speechService: SpeechService) {

    }

    ngOnInit() {
        this._speechService.say("Angular 2 Started");
        this.date = "3/1/2016";
    }
}
