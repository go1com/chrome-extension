import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import configuration from "./environments/configuration";

if (configuration.environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
