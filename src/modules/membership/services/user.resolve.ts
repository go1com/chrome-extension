import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeLast';
import {UserService} from "./user.service";


@Injectable()
export class UserResolve implements Resolve<any> {
  constructor(private userService: UserService) {
  }

  resolve(): Observable<any> {
    return this.userService.currentUser.last(user => {
      return !!user.id;
    });
  }
}
