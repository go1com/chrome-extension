import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../modules/membership/services/user.service';
import {Router} from "@angular/router";
import {AddToPortalChromeCommandHandler} from "../modules/go1core/chromeExtensionsCommandHandler/IChromeCommandHandler";
import {ChromeCmdHandleService} from "../modules/go1core/chromeExtensionsCommandHandler/ChromeCmdHandleService";
import {Go1RuntimeContainer} from "../modules/go1core/services/go1RuntimeContainer";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'GO1 bookmark';
  user;

  constructor(private userService: UserService,
              private router: Router,
              private chromeCmdHandleService: ChromeCmdHandleService,
              private addToPortalCmdHandler: AddToPortalChromeCommandHandler) {
    this.chromeCmdHandleService.registerRouter(router);
    this.chromeCmdHandleService.registerHandler(addToPortalCmdHandler);
  }

  async ngOnInit() {
    const thisAppComponent = this;
    await this.userService.refresh();
    this.user = this.userService.currentUser;

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.command) {
        thisAppComponent.chromeCmdHandleService.handleCommand(request.command, request, sender, sendResponse);
      }
    });

    chrome.runtime.sendMessage({command: "POPUP_INITIALIZED"}, function (response) {
    });

    chrome.tabs.query({active: true}, function (tabs) {
      Go1RuntimeContainer.currentChromeTab = tabs[0];
    });

  }
}
