import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {RestClientService} from "../../go1core/services/RestClientService";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";

@Injectable()
export class UserService {
  private apiUrl = configuration.environment.baseApiUrl;
  public currentUserSubject = new BehaviorSubject<any>({});
  public currentUser = this.currentUserSubject.asObservable();
  private currentUserObject: any = null;

  private isRefreshing = false;
  private isUserRefreshed = false;

  constructor(private restClientService: RestClientService,
              private storageService: StorageService) {
  }

  async login(user: { username: string, password: string }) {
    const postData = {
      instance: configuration.environment.authBackend,
      username: user.username,
      password: user.password
    };

    return await this.restClientService.post(
      `${ this.apiUrl }/${configuration.serviceUrls.user}account/login`,
      postData)
      .then((response) => {
        this.setAuth(response);
        this.currentUserSubject.next(response);

        return response;
      })
      .catch((error) => {
        throw error;
      });
  }

  async register(accountData: any) {
    return await this.restClientService.post(
      `${ this.apiUrl }/${configuration.serviceUrls.user}account/`,
      accountData
    );
  }

  async forgotPasswordRequest(email: string) {
    return await this.restClientService.post(
      `${ this.apiUrl }/${configuration.serviceUrls.user}password/${configuration.environment.defaultPortal}/${email}`,
    );
  }

  async isLoggedIn() {
    return !!await this.storageService.retrieve(configuration.constants.localStorageKeys.uuid);
  }

  async refresh() {
    this.isRefreshing = true;
    const currentUuid = await this.storageService.retrieve(configuration.constants.localStorageKeys.uuid);

    if (currentUuid) {
      try {
        const response = await this.getAuthenticatedUserInfo(currentUuid);
        this.currentUserSubject.next(response);
      } catch (e) {
        await this.cleanAuth();
      }
    } else {
      await this.cleanAuth();
    }
    this.isRefreshing = false;
    this.isUserRefreshed = true;
  }

  async getAuthenticatedUserInfo(userUUID) {
    const response = await this.restClientService.get(`${ this.apiUrl }/${configuration.serviceUrls.user}account/current/${ userUUID }`);
    await this.setAuth(response);
    await this.storageService.store(configuration.constants.localStorageKeys.portalInstances, response.accounts.map(account => account.instance));
    return response;
  }

  async getUserProfile(userId) {
    const response = await this.restClientService.singleGet(
      `${ this.apiUrl }/${configuration.serviceUrls.userProfile}/${ userId }`,
      await this.getCustomHeaders());

    if (response.avatar && response.avatar.startsWith('//')) {
      response.avatar = 'https://' + response.avatar;
    }

    return response;
  }

  switchPortal(portal: any) {
    this.storageService.store(configuration.constants.localStorageKeys.currentActivePortalId, portal.id);
    this.storageService.store(configuration.constants.localStorageKeys.currentActivePortal, portal);
  }

  async getInstanceId() {
    return await this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId);
  }

  private async getCustomHeaders() {
    return {
      'Authorization': `Bearer ${ await this.storageService.retrieve(configuration.constants.localStorageKeys.authentication) }`
    };
  }

  async getUserAutoComplete(query) {
    const currentPortal = await this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortal);
    return this.restClientService.get(
      `${ this.apiUrl }/${configuration.serviceUrls.user}account/chipscontact/${currentPortal.title}/${query}`,
      await this.getCustomHeaders()
    );
  }

  async logout() {
    await this.cleanAuth();
    this.currentUserSubject.next({});
  }

  async getUser() {
    if (this.isRefreshing || !this.isUserRefreshed) {
      await this.refresh();
    }

    this.currentUserObject = await this.storageService.retrieve(configuration.constants.localStorageKeys.user) || null;
    return this.currentUserObject;
  }

  private async setAuth(user) {
    if (!await this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId)) {
      this.storageService.store(configuration.constants.localStorageKeys.currentActivePortalId, user.accounts[0].instance.id);
    }

    return Promise.all([
      this.storageService.store(configuration.constants.localStorageKeys.authentication, user.jwt),
      this.storageService.store(configuration.constants.localStorageKeys.user, user),
      this.storageService.store(configuration.constants.localStorageKeys.uuid, user.uuid),
      this.storageService.store(configuration.constants.localStorageKeys.portalInstances, user.accounts.map(account => account.instance)),
    ]);
  }

  private async cleanAuth() {
    await this.storageService.remove(configuration.constants.localStorageKeys.currentActivePortalId);
    await this.storageService.remove(configuration.constants.localStorageKeys.currentActivePortal);
    await this.storageService.remove(configuration.constants.localStorageKeys.user);
    await this.storageService.remove(configuration.constants.localStorageKeys.authentication);
    await this.storageService.remove(configuration.constants.localStorageKeys.uuid);
    await this.storageService.remove(configuration.constants.localStorageKeys.portalInstances);
  }
}
