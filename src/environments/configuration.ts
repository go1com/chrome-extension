import {environment} from "./index";

const configuration = {
  defaultPage: 'discussions-list',
  environment: environment,
  constants: {
    localStorageKeys: {
      authentication: 'jwt',
      activeInstance: 'activeInstance',
      portalInstance: 'portalInstance',
      user: 'user',
      uuid: 'uuid',
      quickButtonSetting: 'Go1.settings.quickButtonEnabled'
    }
  },
  serviceUrls: {
    user: 'user-service/',
    enrollment: 'enrolment-service/',
    lo: 'lo-service/',
    portal: 'portal-service/',
    noteService: 'note-service/',
    fireBaseNotePath: 'apiom_notes/'
  }
};

export default configuration;
