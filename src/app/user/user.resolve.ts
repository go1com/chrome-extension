import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeLast';

import { UserService } from 'app/user/user.service';

@Injectable()
export class UserResolve implements Resolve<any> {
  constructor(
    private userService: UserService
  ) {}

  resolve(): Observable<any> {
    return this.userService.currentUser.last(user => {console.log(user); return !!user.id;});
  }
}
