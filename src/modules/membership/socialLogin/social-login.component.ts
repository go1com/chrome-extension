import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {ModalDialogService} from "../../go1core/services/ModalDialogService";
import configuration from "../../../environments/configuration";
import {StorageService} from "../../go1core/services/StorageService";

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.pug'
})
export class SocialLoginComponent implements OnInit, OnDestroy {
  provider: any;
  loggingIn: boolean;
  loggedInSuccess: boolean;

  constructor(private currentRoute: ActivatedRoute,
              private userService: UserService,
              private storageService: StorageService,
              private modalDialogService: ModalDialogService,
              private router: Router) {

  }

  async ngOnInit() {
    this.currentRoute.params.subscribe(async params => {
      this.provider = params['oauthProvider'];

      if (this.provider === 'facebook') {
        this.loginWithFacebook();
      } else if (this.provider === 'google') {
        this.loginWithGoogle();
      } else {
        await this.modalDialogService.showAlert(
          'Unsupported OAuth Provider',
          'Error while requesting for Social Login',
          'Close',
          'btn-danger'
        );
        window.close();
      }
    });
  }

  async ngOnDestroy() {
    await this.storageService.remove(configuration.constants.localStorageKeys.socialLogin);
  }

  loginWithFacebook() {
    this.loggingIn = true;

    window.addEventListener('message', (response) => this.onResponse(response));
    window.open(`${configuration.environment.baseApiUrl}/${configuration.serviceUrls.facebookAuth}`, 'social_login_facebook');
  }

  loginWithGoogle() {
    this.loggingIn = true;

    window.addEventListener('message', (response) => this.onResponse(response));
    window.open(`${configuration.environment.baseApiUrl}/${configuration.serviceUrls.googleAuth}`, 'social_login_google');
  }

  async onResponse(message) {
    if (!message.data) {
      return;
    }

    const data = JSON.parse(message.data);
    if (!data) {
      return;
    }

    window.removeEventListener('message', (response) => this.onResponse(response));

    await this.userService.getAuthenticatedUserInfo(data.uuid);
    this.loggingIn = false;

    this.loggedInSuccess = true;
    await this.storageService.remove(configuration.constants.localStorageKeys.socialLogin);

    const pageToNavigate = await this.storageService.retrieve('redirectAfterLoggedIn') || '/' + configuration.defaultPage;

    await this.router.navigate([pageToNavigate]);

    await this.storageService.remove('redirectAfterLoggedIn');
  }

  close() {
    window.close();
  }
}
