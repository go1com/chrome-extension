export interface Environment {
  production: boolean;
  baseApiUrl: string,
  fireBaseNotePath: string,
  noteServicePath: string,

  firebase:  {
    apiKey: string,
    authDomain: string,
    databaseURL: string
  },
  constants: {
    localStorageKeys: {
      quickButtonSetting: string
    }
  }
}
