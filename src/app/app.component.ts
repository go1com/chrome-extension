import {Component, Inject, OnInit, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {Go1RuntimeContainer} from "../modules/go1core/services/go1RuntimeContainer";
import {Overlay} from "angular2-modal";
import {ModalDialogService} from "../modules/go1core/services/ModalDialogService";
import configuration from "../environments/configuration";
import {UserService} from "../modules/membership/services/user.service";
import {Router} from "@angular/router";
import {StorageService} from "../modules/go1core/services/StorageService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'GO1 bookmark';

  constructor(@Inject(Overlay) private overlay: Overlay,
              private vcRef: ViewContainerRef,
              public modalDialogService: ModalDialogService,
              private userService: UserService,
              private storageService: StorageService,
              private router: Router) {
    overlay.defaultViewContainer = vcRef;
    modalDialogService.setViewContainer(vcRef);
  }

  async ngOnInit() {
    await new Promise(resolve => {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        Go1RuntimeContainer.currentChromeTab = tabs[0];
        resolve();
      });
    });

    if (this.storageService.retrieve(configuration.constants.localStorageKeys.socialLogin)) {
      return
    }

    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/' + configuration.defaultPage]);
    } else {
      this.router.navigate(['/membership/login']);
    }
  }
}
