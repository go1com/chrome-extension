import {Component} from "@angular/core";

@Component({
  selector: 'user-sign-up',
  templateUrl: './sign-up.component.pug'
})
export class SignUpComponent {
  loading: boolean = false;
  signingup: boolean = false;
}
