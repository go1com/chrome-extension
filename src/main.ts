import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import configuration from "./environments/configuration";

if (configuration.environment.production) {
  enableProdMode();
}


chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
  configuration.currentChromeTab = tabs[0];
  chrome.runtime.connect();
  platformBrowserDynamic().bootstrapModule(AppModule);
});
