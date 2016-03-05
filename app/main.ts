import {bootstrap} from "angular2/platform/browser";
import {AppComponent} from "./app.component";

bootstrap(AppComponent)
    .then(succes=> console.log('bootstrap success'))
    .catch(error=> console.log(error));
