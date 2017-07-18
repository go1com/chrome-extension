import {Component, Input} from "@angular/core";

@Component({
  selector: 'go-header',
  templateUrl: './goHeader.tpl.html',
  styleUrls: ['./go1header.component.css']
})
export class Go1HeaderComponent {
  @Input() activePage: string;

  constructor() {

  }
}
