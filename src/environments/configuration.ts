import {environment} from "./index";

const configuration = {
  version: '@EXTENSION_VERSION@',
  defaultPage: 'discussionsList/',
  environment: environment,
  currentChromeTab: null,
  constants: {
    indexPage: `chrome-extension://${chrome.runtime.id}/index.html`,
    popupDefaultName: 'GO1_EXTENSION_POPUP',
    momentISOFormat: 'YYYY-MM-DD[T]HH:mm:ssZZ',
    noteChromeExtType: 'chromeext',
    notePortalType: 'portal',
    noteLiType: 'li',
    noteStatuses: {
      PUBLIC_NOTE: 2,
      PRIVATE_NOTE: 0
    },
    localStorageKeys: {
      authentication: 'jwt',
      currentActivePortalId: 'currentActivePortalId',
      currentActivePortal: 'currentActivePortal',
      portalInstances: 'portalInstances',
      user: 'user',
      uuid: 'uuid',
      quickButtonSetting: 'Go1.settings.quickButtonEnabled',
      createNoteSetting: 'Go1.settings.createNoteEnabled',
      highlightNoteSetting: 'Go1.settings.highlightNotesEnabled',
      socialLogin: 'socialLoggingIn',
      createNoteParams: 'GO1.Command.createNoteParams',
      addToPortalParams: 'GO1.Command.addToPortalParams',
      cacheLearningItem: 'GO1.shareLearning.learningItemId_',
      sharedLiToUser: 'GO1.shareLearning.sharedLiToUser'
    }
  },
  serviceUrls: {
    notification: 'https://realtime.mygo1.com',
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
    notifications: 'notifications',
    shareLearningItem: 'shareLearningItem',
    scheduleLearningItem: 'scheduleLearningItem',
    discussionsList: 'discussionsList',
    discussionDetail: 'discussionDetail',
    newDiscussion: 'newDiscussion'
  }
};

export default configuration;
