import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import go1Config from "../../go1core/go1core.config";

@Injectable()
export class UserService {
  private headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json'});
  private apiUrl = go1Config.baseApiUrl;
  public currentUserSubject = new BehaviorSubject<any>({});
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: Http) {
  }

  login(user: { username: string, password: string }): Observable<any> {
    const postData = {instance: 'accounts-dev.gocatalyze.com', username: user.username, password: user.password};

    return this.http.post(`${ this.apiUrl }/user-service/account/login`,
      postData,
      {
        headers: this.headers
      })
    // .toPromise()
      .map((response: Response) => {
        const responseUser = response.json();

        this.setAuth(responseUser);
        this.currentUserSubject.next(responseUser);

        return responseUser;
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  refresh() {
    const currentUuid = localStorage.getItem('uuid');

    if (currentUuid) {
      this.http.get(`${ this.apiUrl }/user-service/account/current/${ currentUuid }`).subscribe(
        (response: Response) => this.currentUserSubject.next(response.json()),
        () => this.cleanAuth()
      );
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

  private setAuth(user) {
    localStorage.setItem('jwt', user.jwt);
    localStorage.setItem('uuid', user.uuid);
    localStorage.setItem('activeInstance', user.accounts[0].instance.id);
  }

  private cleanAuth() {
    localStorage.removeItem('activeInstance');
    localStorage.removeItem('jwt');
    localStorage.removeItem('uuid');
  }
}
