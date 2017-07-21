import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import go1Config from "../../go1core/go1core.config";
import {RestClientService} from "../../go1core/services/RestClientService";

@Injectable()
export class UserService {
  private headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json'});
  private apiUrl = go1Config.baseApiUrl;
  public currentUserSubject = new BehaviorSubject<any>({});
  public currentUser = this.currentUserSubject.asObservable();
  private currentUserObject: any = null;

  constructor(private http: Http, private restClientService: RestClientService) {
  }

  async login(user: { username: string, password: string }) {
    const postData = {instance: 'accounts-dev.gocatalyze.com', username: user.username, password: user.password};

    return await this.restClientService.postAsync(
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
    const currentUuid = localStorage.getItem('uuid');

    if (currentUuid) {
      try {
        const response = await this.restClientService.getAsync(`${ this.apiUrl }/user-service/account/current/${ currentUuid }`);
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
    localStorage.setItem('activeInstance', portal.id);
  }

  getInstanceId(): string {
    return localStorage.getItem('activeInstance');
  }

  logout() {
    this.cleanAuth();
    this.currentUserSubject.next({});
  }

  getUser() {
    if (this.currentUserObject)
      return this.currentUserObject;

    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      this.currentUserObject = JSON.parse(userStorage);
      return this.currentUserObject;
    }

    return null;
  }

  private setAuth(user) {
    localStorage.setItem('jwt', user.jwt);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('uuid', user.uuid);
    localStorage.setItem('activeInstance', user.accounts[0].instance.id);
  }

  private cleanAuth() {
    localStorage.removeItem('activeInstance');
    localStorage.removeItem('jwt');
    localStorage.removeItem('uuid');
  }
}
