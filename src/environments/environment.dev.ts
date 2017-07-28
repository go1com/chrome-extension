import {Environment} from "./environment";

export const environment: Environment = {
  production: false,

  baseApiUrl: 'https://api-dev.mygo1.com/v3',
  fireBaseNotePath: 'apiom_notes/',
  noteServicePath: 'note-service/',

  firebase: {
    apiKey: 'AIzaSyD1ZxCmbiqgizgZOefDAn56YMb99A8CspM',
    authDomain: 'notes-c4d57.firebaseapp.com',
    databaseURL: 'https://notes-c4d57.firebaseio.com'
  },
  constants: {
    localStorageKeys: {
      quickButtonSetting: 'Go1.settings.quickButtonEnabled'
    }
  }
};
