import {environment} from "./index";

const configuration = {
  version: '@EXTENSION_VERSION@',
  defaultPage: 'discussionsList/',
  environment: environment,
  currentChromeTab: null,
  constants: {
    indexPage: `chrome-extension://${chrome.runtime.id}/index.html`,
    popupDefaultName: 'GO1_EXTENSION_POPUP',
    localStorageKeys: {
      authentication: 'jwt',
      currentActivePortalId: 'currentActivePortalId',
      currentActivePortal: 'currentActivePortal',
      portalInstances: 'portalInstances',
      user: 'user',
      uuid: 'uuid',
      quickButtonSetting: 'Go1.settings.quickButtonEnabled',
      createNoteSetting: 'Go1.settings.createNoteEnabled',
      socialLogin: 'socialLoggingIn',
      createNoteParams: 'GO1.Command.createNoteParams',
      addToPortalParams: 'GO1.Command.addToPortalParams',
      cacheLearningItem: 'GO1.shareLearning.learningItemId_',
      sharedLiToUser: 'GO1.shareLearning.sharedLiToUser'
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
    shareLearningItem: 'shareLearningItem',
    discussionsList: 'discussionsList',
    discussionDetail: 'discussionDetail',
    newDiscussion: 'newDiscussion'
  }
};

export default configuration;
