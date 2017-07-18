import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {LoService} from "../core/services/lo.service";


@Component({
  selector: 'complete',
  templateUrl: './complete.component.html',
  providers: [LoService],
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {
  private title: string;
  private redirect: string;
  private redirectMask: string;

  constructor(
    private loService: LoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe( params => {
      this.title = params.title;
      this.redirect = params.redirect;
      this.redirectMask = params.redirectMask;
    });
  }
}
