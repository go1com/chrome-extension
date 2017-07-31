import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Go1RuntimeContainer} from "../../go1core/services/go1RuntimeContainer";
import {environment} from "../../../environments";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {routeNames} from "../addToPortal.routes";

@Component({
  selector: 'add-to-portal',
  templateUrl: '../../../views/addToPortal.pug'
})
export class AddToPortalComponent {
  data: any;

  constructor(private router: Router,
              private currentActiveRoute: ActivatedRoute,
              private storageService: StorageService) {
    this.data = {
      title: '',
      description: '',
      type: 'resource',
      tags: [],
      data: {
        type: 'weblink',
        path: Go1RuntimeContainer.currentChromeTab.url,
      },
      instance: storageService.retrieve(environment.constants.localStorageKeys.portalInstance)
    };
  }

  async markAsComplete() {
    await this.router.navigate(['./' + routeNames.success], {relativeTo: this.currentActiveRoute});
  }

  goBack() {
    this.router.navigate(['/' + configuration.defaultPage]);
  }

  async saveForLater() {
    await this.router.navigate(['./' + routeNames.saveForLater], {relativeTo: this.currentActiveRoute});
  }
}
