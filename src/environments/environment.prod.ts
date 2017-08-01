import {Environment} from "./environment";

export const environment: Environment = {
  production: true,
  authBackend: 'accounts.gocatalyze.com',
  baseApiUrl: 'https://api.mygo1.com/v3',
  serviceUrls: {
    user: 'user-service/',
    enrollment: 'enrolment-service/',
    lo: 'lo-service/',
    portal: 'portal-service/',
    noteService: 'note-service/',
    fireBaseNotePath: 'apiom_notes/'
  },

  firebase: {
    apiKey: 'AIzaSyD1ZxCmbiqgizgZOefDAn56YMb99A8CspM',
    authDomain: 'notes-c4d57.firebaseapp.com',
    databaseURL: 'https://notes-c4d57.firebaseio.com'
  }
};
