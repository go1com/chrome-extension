export interface Environment {
  production: boolean
  baseApiUrl: string
  authBackend: string

  firebase:  {
    apiKey: string,
    authDomain: string,
    databaseURL: string
  }
}
