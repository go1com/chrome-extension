import {Component} from "@angular/core";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {ModalDialogService} from "../../go1core/services/ModalDialogService";

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.pug'
})
export class ForgotPasswordComponent {
  loading: boolean = false;
  requestingNewPassword: boolean = false;
  username: string = '';

  constructor(private userService: UserService,
              private router: Router,
              private modalDialogService: ModalDialogService) {

  }

  canRequestNewPassword(): boolean {
    return !!this.username;
  }

  async requestNewPassword() {
    if (!this.username)
      return;

    this.requestingNewPassword = true;
    try {
      await this.userService.forgotPasswordRequest(this.username);
      await this.router.navigate(['/membership/forgotPasswordSuccess', this.username]);
    } catch (e) {
      await this.modalDialogService.showAlert(e.message);
    } finally {
      this.requestingNewPassword = false;
    }
  }
}
