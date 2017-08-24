import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'redirecting',
  templateUrl: './redirecting.component.pug'
})
export class RedirectingComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {

  }

  async ngOnInit() {
    console.log('activatedRoute', this.activatedRoute);
  }
}
