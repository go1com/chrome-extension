import {Component, Input} from "@angular/core";
import {UserService} from "../services/user.service";

@Component({
  selector: 'user-profile',
  templateUrl: './userProfile.component.pug'
})
export class UserProfileComponent {
  @Input() userId: any;

  @Input() externalText: string;

  userProfile: any;

  constructor(private userService: UserService) {

  }

  async ngOnInit() {
    this.userProfile = await this.userService.getUserProfile(this.userId);
  }

  async ngAfterViewInit() {

  }
}
