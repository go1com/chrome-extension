import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import configuration from "./environments/configuration";

enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);

if (chrome && chrome.tabs && chrome.tabs.query) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    configuration.currentChromeTab = tabs[0];
    chrome.runtime.connect();
  });
}
