import {Component, provide, Input, OnInit} from "angular2/core";

import {SpeechService, RecognitionState} from "./speechService/speech.service";
import {WeatherComponent} from "./weatherComponent/weather.component";
import {EmitMessageService} from "./emit.service";

@Component({
    selector: "my-app",
    templateUrl: 'app/app.component.html',
    directives: [
        WeatherComponent
    ],
    providers: [
        SpeechService,
        EmitMessageService
    ]
})

export class AppComponent implements OnInit{
    public date: string;
    public speakingStatus: string;
    public emitMessage: string;
    public speechError: string;
    public recognitionState: RecognitionState;


    constructor(private _speechService: SpeechService,
                private _emitService: EmitMessageService) {
        this.speakingStatus = "...";
        this.speechError = "...";
        this.emitMessage = "...";

        this._emitService.onEventEmitted.subscribe(message => this.onEmit(message));

        this._speechService.onSpeaking.subscribe(phrase => {
            this.onSpeaking(phrase)
        });
        this._speechService.onSpeechStateChanged.subscribe(state => {
            this.onSpeechStateChanged(state);
        });
        this._speechService.onSpeechRecognized.subscribe(tag => {
            this.onRecognized(tag)
        });
        this._speechService.onSpeechError.subscribe(error => {
            this.onSpeechError(error)
        });
    }

    onEmit(message: string) {
        this.emitMessage = message;
        
    }

    ngOnInit() {
        this.date = "3/10/2016";
        this._speechService.say("Here we go!");
        this.emitMessage = "loading...";
    }

    ngAfterViewChecked() {
        //console.log("VIEW CHECKED!!!!");
       
    }

    ngAfterContentChecked() {
        //console.log("CONTENT CHECKED!!!!");
    }    

    clicked() {
        this.speakingStatus = "clicked";
        console.log("clicked");
    }

    onSpeaking(text: string) {
        console.log("App.Component:: speaking: " + text);
        this.speakingStatus = text;
    }

    onRecognized(tag: string) {
        console.log("App.Component:: recognized: " + tag);
        this.speakingStatus = tag;
    }

    onSpeechStateChanged(state: string) {
        console.log("App.Component: speech state changed: " + state);
        
        this.recognitionState = this._speechService.recognitionState;
        
    }

    onSpeechError(error: string) {
        console.error("ERROR: App.Component:  Speech Error: " + error);
        this.speechError = error;
    
        if (this._speechService.recognitionState == RecognitionState.Error) {
            this.recognitionState = RecognitionState.Error;
        }       

    }
}
