import {Component} from "@angular/core";
import {ModalDialogService} from "../../go1core/services/ModalDialogService";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import configuration from "../../../environments/configuration";

@Component({
  selector: 'user-sign-up',
  templateUrl: './sign-up.component.pug'
})
export class SignUpComponent {
  loading: boolean = false;
  signingUp: boolean = false;
  emailInvalidFormat: boolean = false;
  signUpData: any;

  constructor(private userService: UserService,
              private router: Router,
              private modalDialogService: ModalDialogService) {

  }

  ngOnInit() {
    this.signUpData = {
      instance: configuration.environment.authBackend,
      portal: configuration.environment.defaultPortal,
      email: '',
      random: true,
      first_name: '',
      last_name: '',
      data: {}
    };
  }

  validateEmailFormat() {
    if (!this.signUpData.email) {
      return;
    }

    this.emailInvalidFormat = !this.validateEmail();
  }

  validateEmail(): boolean {
    if (!this.signUpData.email)
      return false;

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.signUpData.email);
  }

  canSignUp() {
    return this.signUpData.email && this.signUpData.first_name && this.signUpData.last_name && this.validateEmail();
  }

  async signUp() {
    this.signingUp = true;

    try {
      const response = await this.userService.register(this.signUpData);
      if (response.jwt) {
        await this.userService.getAuthenticatedUserInfo(response.uuid);
      }
      await this.router.navigate(['/membership/signUpSuccess', this.signUpData.email]);
    } catch (e) {
      await this.modalDialogService.showAlert(e.message, 'Error while signing up', 'OK', 'btn-warning');
    } finally {
      this.signingUp = false;
    }
  }
}
