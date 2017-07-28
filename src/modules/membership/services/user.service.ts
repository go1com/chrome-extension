import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {RestClientService} from "../../go1core/services/RestClientService";
import {StorageService} from "../../go1core/services/StorageService";
import {environment} from "../../../environments/index";

@Injectable()
export class UserService {
  private apiUrl = environment.baseApiUrl;
  public currentUserSubject = new BehaviorSubject<any>({});
  public currentUser = this.currentUserSubject.asObservable();
  private currentUserObject: any = null;

  constructor(private restClientService: RestClientService,
              private storageService: StorageService) {
  }

  async login(user: { username: string, password: string }) {
    const postData = {instance: 'accounts-dev.gocatalyze.com', username: user.username, password: user.password};

    return await this.restClientService.post(
      `${ this.apiUrl }/user-service/account/login`,
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
    const currentUuid = this.storageService.retrieve('uuid');

    if (currentUuid) {
      try {
        const response = await this.restClientService.get(`${ this.apiUrl }/user-service/account/current/${ currentUuid }`);
        this.currentUserSubject.next(response);
      } catch (e) {
        this.cleanAuth();
      }
    } else {
      this.cleanAuth();
    }
  }

  switchPortal(portal: any) {
    console.log(portal);
    console.log(portal.id);
    this.storageService.store('activeInstance', portal.id);
  }

  getInstanceId(): string {
    return this.storageService.retrieve('activeInstance');
  }

  logout() {
    this.cleanAuth();
    this.currentUserSubject.next({});
  }

  getUser() {
    if (this.currentUserObject)
      return this.currentUserObject;

    this.currentUserObject = this.storageService.retrieve('user') || null;
    return this.currentUserObject;
  }

  private setAuth(user) {
    this.storageService.store('jwt', user.jwt);
    this.storageService.store('user', user);
    this.storageService.store('uuid', user.uuid);
    this.storageService.store('activeInstance', user.accounts[0].instance.id);
  }

  private cleanAuth() {
    this.storageService.remove('activeInstance');
    this.storageService.remove('user');
    this.storageService.remove('jwt');
    this.storageService.remove('uuid');
  }
}
