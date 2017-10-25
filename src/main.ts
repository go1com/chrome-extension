import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import configuration from "./environments/configuration";
import {commandKeys} from "./environments/commandKeys";

enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
