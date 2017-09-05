import {Component, Input} from "@angular/core";
import configuration from "../../../environments/configuration";

@Component({
  selector: 'go-header',
  templateUrl: './goHeader.tpl.pug',
  styleUrls: ['./go1header.component.scss']
})
export class Go1HeaderComponent {
  @Input() activePage: string;
  @Input() title: string;

  constructor() {
  }

  canShowBackAndSetting() {
    return window.name !== configuration.constants.popupDefaultName;
  }
}
