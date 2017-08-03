import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../modules/membership/services/user.service';
import {Go1RuntimeContainer} from "../modules/go1core/services/go1RuntimeContainer";
import {PortalService} from "../modules/portal/services/PortalService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'GO1 bookmark';
  user;

  constructor(private userService: UserService, private portalService: PortalService) {
  }

  async ngOnInit() {
    await this.userService.refresh();
    this.user = this.userService.currentUser;

    await this.portalService.getPortal();
    return new Promise(resolve => {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        Go1RuntimeContainer.currentChromeTab = tabs[0];
        resolve();
      });
    });
  }
}
