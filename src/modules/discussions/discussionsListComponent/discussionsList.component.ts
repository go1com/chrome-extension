import {Component, OnDestroy, OnInit} from "@angular/core";

@Component({
  selector: 'app-discussions-list',
  templateUrl: './discussionsList.component.html',
  styleUrls: ['./discussionsList.component.css']
})
export class DiscussionsListComponent implements OnInit, OnDestroy {
  discussionsList: any[];

  constructor() {
    this.discussionsList = [];
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

  addDiscussion(): void {
    alert('add discussion clicked');
  }
}
