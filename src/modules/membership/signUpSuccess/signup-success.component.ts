import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import configuration from "../../../environments/configuration";

@Component({
  selector: 'signup-success',
  templateUrl: './signup-success.component.pug'
})
export class SignupSuccessComponent {
  email: string = '';

  constructor(private currentRoute: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.currentRoute.params.subscribe(params => {
      this.email = params['email'];
    });
  }

  getStarted() {
    this.router.navigate(['/' + configuration.defaultPage]);
  }
}
