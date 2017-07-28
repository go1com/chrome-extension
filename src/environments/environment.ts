export interface Environment {
  production: boolean
  baseApiUrl: string
  authBackend: string

  serviceUrls: {
    user: string,
    enrollment: string,
    lo: string,
    portal: string,
    noteService: string,
    fireBaseNotePath: string,
  }

  firebase:  {
    apiKey: string,
    authDomain: string,
    databaseURL: string
  }

  constants: {
    localStorageKeys: {
      authentication: string,
      portalInstance: string,
      user: string,
      uuid: string,
      quickButtonSetting: string
    }
  }
}
