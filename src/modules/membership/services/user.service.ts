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

  private isRefreshing: boolean = false;
  private isUserRefreshed: boolean = false;

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

  async refresh() {
    this.isRefreshing = true;
    const currentUuid = this.storageService.retrieve(configuration.constants.localStorageKeys.uuid);

    if (currentUuid) {
      try {
        const response = await this.restClientService.get(`${ this.apiUrl }/${configuration.serviceUrls.user}account/current/${ currentUuid }`);
        this.setAuth(response);
        this.storageService.store(configuration.constants.localStorageKeys.portalInstances, response.accounts.map(account => account.instance));
        this.currentUserSubject.next(response);
      } catch (e) {
        this.cleanAuth();
      }
    } else {
      this.cleanAuth();
    }
    this.isRefreshing = false;
    this.isUserRefreshed = true;
  }

  switchPortal(portal: any) {
    this.storageService.store(configuration.constants.localStorageKeys.activeInstance, portal.id);
  }

  getInstanceId(): string {
    return this.storageService.retrieve(configuration.constants.localStorageKeys.activeInstance);
  }

  logout() {
    this.cleanAuth();
    this.currentUserSubject.next({});
  }

  async getUser() {
    if (this.isRefreshing || !this.isUserRefreshed) {
      await this.refresh();
    }

    if (this.currentUserObject)
      return this.currentUserObject;

    this.currentUserObject = this.storageService.retrieve(configuration.constants.localStorageKeys.user) || null;
    return this.currentUserObject;
  }

  private setAuth(user) {
    this.storageService.store(configuration.constants.localStorageKeys.authentication, user.jwt);
    this.storageService.store(configuration.constants.localStorageKeys.user, user);
    this.storageService.store(configuration.constants.localStorageKeys.uuid, user.uuid);
    this.storageService.store(configuration.constants.localStorageKeys.activeInstance, user.accounts[0].instance.id);
    this.storageService.store(configuration.constants.localStorageKeys.portalInstances, user.accounts.map(account => account.instance));
  }

  private cleanAuth() {
    this.storageService.remove(configuration.constants.localStorageKeys.activeInstance);
    this.storageService.remove(configuration.constants.localStorageKeys.user);
    this.storageService.remove(configuration.constants.localStorageKeys.authentication);
    this.storageService.remove(configuration.constants.localStorageKeys.uuid);
    this.storageService.remove(configuration.constants.localStorageKeys.portalInstances);
  }
}
