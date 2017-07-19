import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { UserService } from '../modules/membership/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'GO1 bookmark';
  user;

  constructor(private userService: UserService) {}

  async ngOnInit() {
    await this.userService.refresh();
    this.user = this.userService.currentUser;
  }
}
