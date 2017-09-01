import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {routeNames} from "../addToPortal.routes";

@Component({
  selector: 'learning-item-schedule',
  templateUrl: './addToPortalSchedule.pug'
})
export class LearningItemScheduleComponent {
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
        path: configuration.currentChromeTab.url,
      },
      instance: storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId)
    };
  }

  async save() {
    await this.router.navigate(['../' + routeNames.success], {relativeTo: this.currentActiveRoute});
  }

  goBack() {
    this.router.navigate(['../' + routeNames.defaultPage], {relativeTo: this.currentActiveRoute});
  }
}
