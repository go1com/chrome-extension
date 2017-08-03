export interface Environment {
  production: boolean
  baseApiUrl: string
  authBackend: string
  defaultPortal: string
  firebase: {
    apiKey: string,
    authDomain: string,
    databaseURL: string
  }
}
