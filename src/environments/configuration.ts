import {environment} from "./index";

const configuration = {
  defaultPage: 'discussionsList/',
  environment: environment,
  currentChromeTab: null,
  constants: {
    indexPage: `chrome-extension://${chrome.runtime.id}/index.html`,
    localStorageKeys: {
      authentication: 'jwt',
      currentActivePortalId: 'currentActivePortalId',
      currentActivePortal: 'currentActivePortal',
      portalInstances: 'portalInstances',
      user: 'user',
      uuid: 'uuid',
      quickButtonSetting: 'Go1.settings.quickButtonEnabled',
      socialLogin: 'socialLoggingIn'
    }
  },
  serviceUrls: {
    user: 'user-service/',
    userProfile: 'social-service/profile',
    facebookAuth: 'social-login/fb-login',
    googleAuth: 'social-login/google-login',
    enrollment: 'enrolment-service/',
    lo: 'lo-service/',
    portal: 'portal-service/',
    noteService: 'note-service/',
    fireBaseNotePath: 'apiom_notes/'
  },
  pages: {
    membershipModule: '/membership',
    discussionModule: '/discussionsList',
    addToPortalModule: '/addToPortal',
    fbLogin: '/membership/socialLogin/facebook',
    ggLogin: '/membership/socialLogin/google',
    addToPortal: 'addToPortal',
    discussionsList: 'discussionsList',
    discussionDetail: 'discussionDetail',
    newDiscussion: 'newDiscussion'
  }
};

export default configuration;
