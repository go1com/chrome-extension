import {Component, Inject, OnInit, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {UserService} from '../modules/membership/services/user.service';
import {Go1RuntimeContainer} from "../modules/go1core/services/go1RuntimeContainer";
import {Overlay} from "angular2-modal";
import {ModalDialogService} from "../modules/go1core/services/ModalDialogService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'GO1 bookmark';

  constructor(private userService: UserService,
              @Inject(Overlay) private overlay: Overlay,
              private vcRef: ViewContainerRef,
              public modalDialogService: ModalDialogService) {
    overlay.defaultViewContainer = vcRef;
    modalDialogService.setViewContainer(vcRef);
    this.userService.refresh();
  }

  async ngOnInit() {
    return new Promise(resolve => {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        Go1RuntimeContainer.currentChromeTab = tabs[0];
        resolve();
      });
    });
  }
}
