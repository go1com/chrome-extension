import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'forgot-password-success',
  templateUrl: './forgot-password-success.component.pug'
})
export class ForgotPasswordSuccessComponent {
  email: string = '';

  constructor(private currentRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.currentRoute.params.subscribe(params => {
      this.email = params['email'];
    });
  }
}
