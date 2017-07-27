// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
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
