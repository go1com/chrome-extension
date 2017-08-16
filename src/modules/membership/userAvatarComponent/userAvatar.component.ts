import {Component, Input} from "@angular/core";
import {UserService} from "../services/user.service";

@Component({
  selector: 'user-avatar',
  templateUrl: './userAvatar.component.pug'
})
export class UserAvatarComponent {
  @Input() userId: any;

  userProfile: any;

  constructor(private userService: UserService) {

  }

  async ngOnInit() {
    this.userProfile = await this.userService.getUserProfile(this.userId);
  }

  async ngAfterViewInit() {

  }
}
