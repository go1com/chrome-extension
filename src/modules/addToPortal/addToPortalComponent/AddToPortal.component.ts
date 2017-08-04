import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Go1RuntimeContainer} from "../../go1core/services/go1RuntimeContainer";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {routeNames} from "../addToPortal.routes";
import {AddToPortalService} from "../services/AddToPortalService";
import {commandKeys} from "../../../commandHandlers/commandKeys";

@Component({
  selector: 'add-to-portal',
  templateUrl: '../../../views/addToPortal.pug'
})
export class AddToPortalComponent {
  data: any;

  constructor(private router: Router,
              private addToPortalService: AddToPortalService,
              private currentActiveRoute: ActivatedRoute,
              private storageService: StorageService) {
    this.data = {
      title: '',
      description: '',
      type: 'iframe',
      tags: [],
      data: {},
      single_li: true,
      published: 1,
      instance: this.storageService.retrieve(configuration.constants.localStorageKeys.activeInstance)
    };
  }

  async ngOnInit() {
    if (!Go1RuntimeContainer.currentChromeTab || !Go1RuntimeContainer.currentChromeTab.url) {
      await new Promise(resolve => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          Go1RuntimeContainer.currentChromeTab = tabs[0];
          resolve();
        });
      });
    }

    const pageMeta: any = await this.loadPageMetadata(Go1RuntimeContainer.currentChromeTab.url);
    this.data = {
      title: pageMeta.title,
      description: pageMeta.description,
      type: 'iframe',
      tags: [],
      data: {
        path: Go1RuntimeContainer.currentChromeTab.url
      },
      single_li: true,
      published: 1,
      instance: this.storageService.retrieve(configuration.constants.localStorageKeys.activeInstance),
      author: this.storageService.retrieve(configuration.constants.localStorageKeys.user).mail
    };
  }

  private async loadPageMetadata(url) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        action: commandKeys.getLinkPreview,
        data: url
      }, (response) => {
        resolve(response.data);
      });
    });
  }

  async markAsComplete() {
    const response = await this.addToPortalService.addToPortal(this.data);
    console.log(response);
    debugger;
    await this.router.navigate(['./' + routeNames.success], {relativeTo: this.currentActiveRoute});
  }

  goBack() {
    this.router.navigate(['/' + configuration.defaultPage]);
  }

  async saveForLater() {
    await this.router.navigate(['./' + routeNames.saveForLater], {relativeTo: this.currentActiveRoute});
  }
}
