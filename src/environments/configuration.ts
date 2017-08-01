import {environment} from "./index";

const configuration = {
  defaultPage: 'discussions-list',
  environment: environment,
  constants: {
    localStorageKeys: {
      authentication: 'jwt',
      portalInstance: 'activeInstance',
      user: 'user',
      uuid: 'uuid',
      quickButtonSetting: 'Go1.settings.quickButtonEnabled'
    }
  }
};

export default configuration;
