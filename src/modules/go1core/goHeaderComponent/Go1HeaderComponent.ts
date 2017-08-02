import {Component, Input} from "@angular/core";

@Component({
  selector: 'go-header',
  templateUrl: './goHeader.tpl.pug',
  styleUrls: ['./go1header.component.scss']
})
export class Go1HeaderComponent {
  @Input() activePage: string;

  constructor() {

  }
}
