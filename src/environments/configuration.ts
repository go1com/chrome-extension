import {environment} from "./index";

const configuration = {
  defaultPage: 'discussionsList/',
  environment: environment,
  constants: {
    localStorageKeys: {
      authentication: 'jwt',
      currentActivePortalId: 'currentActivePortalId',
      currentActivePortal: 'currentActivePortal',
      portalInstances: 'portalInstances',
      user: 'user',
      uuid: 'uuid',
      quickButtonSetting: 'Go1.settings.quickButtonEnabled'
    }
  },
  serviceUrls: {
    user: 'user-service/',
    facebookAuth: 'social-login/fb-login',
    googleAuth: 'social-login/google-login',
    enrollment: 'enrolment-service/',
    lo: 'lo-service/',
    portal: 'portal-service/',
    noteService: 'note-service/',
    fireBaseNotePath: 'apiom_notes/'
  },
  pages: {
    addToPortal: 'addToPortal',
    discussionsList: 'discussionsList'
  }
};

export default configuration;
