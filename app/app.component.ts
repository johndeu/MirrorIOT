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
      
        this.date = "3/1/2016";       
 
       
        this._speechService.onSpeaking.subscribe(this.onSpeaking);
        this._speechService.onSpeechStateChanged.subscribe(this.onSpeechStateChanged);
        this._speechService.onSpeechRecognized.subscribe(this.onRecognized);
        this._speechService.onSpeechError.subscribe(this.onSpeechError);

         this._speechService.say("Started");
    }
    
    onSpeaking(text:string){
        console.log("App.Component:: speaking: " + text);
    }
    
    onRecognized(tag:string) {
        console.log("App.Component:: recognized: " + tag);
    }
    
    onSpeechStateChanged(state:string) {
        console.log("App.Component: speech state changed: " + state);
    }

    onSpeechError(error: string) {
        console.error("ERROR: App.Component:  Speech Error: " + error);
    }
}
