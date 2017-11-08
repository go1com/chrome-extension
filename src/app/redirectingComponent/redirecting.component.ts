import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-redirecting',
  templateUrl: './redirecting.component.pug'
})
export class RedirectingComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {

  }

  async ngOnInit() {
  }
}
