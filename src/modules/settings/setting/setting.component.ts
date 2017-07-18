import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../membership/services/user.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  private user;

  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (user) => {
        this.user = user;
      }
    );
  }

  signout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
