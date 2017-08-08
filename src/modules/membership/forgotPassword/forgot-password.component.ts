import {Component} from "@angular/core";

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.pug'
})
export class ForgotPasswordComponent {
  loading: boolean = false;
  username: string = '';
}
