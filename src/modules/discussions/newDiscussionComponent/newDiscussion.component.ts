import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {RestClientService} from "../../go1core/services/RestClientService";

@Component({
  selector: 'app-new-discussion',
  templateUrl: './newDiscussion.component.html'
})
export class NewDiscussionComponent implements OnInit {
  constructor(private router: Router,
              private restClientService: RestClientService) {

  }

  async ngOnInit() {

  }


}
