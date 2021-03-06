import {Component, OnDestroy, OnInit} from "@angular/core";
import configuration from "../../../environments/configuration";
import {StorageService} from "../../go1core/services/StorageService";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-to-portal-success',
  templateUrl: './addToPortalSuccess.pug'
})
export class AddToPortalSuccessComponent implements OnInit, OnDestroy {
  learningItem: any;
  courses: any[];
  selectedCourseIds: any[];
  currentPortal: any;
  sharedToUser: null;

  constructor(private router: Router,
              private currentActiveRoute: ActivatedRoute,
              private storageService: StorageService) {
    this.courses = [];
    this.selectedCourseIds = [];
  }

  async ngOnInit() {

    this.currentActiveRoute.params.subscribe(params => {
      this.learningItem = params['learningItemId'];
    });

    if (await this.storageService.exists(configuration.constants.localStorageKeys.sharedLiToUser)) {
      this.sharedToUser = await this.storageService.retrieve(configuration.constants.localStorageKeys.sharedLiToUser);
      await this.storageService.remove(configuration.constants.localStorageKeys.sharedLiToUser);
    }

    this.currentPortal = await this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortal);
  }

  async ngOnDestroy() {
    await this.storageService.remove(configuration.constants.localStorageKeys.sharedLiToUser);
  }

  viewPageOnPortal() {
    window.open(`https://${this.currentPortal.title}/p/#/app/my-teaching/resources/`, '_blank');
    window.close();
  }

  async shareButtonClicked() {
    await this.router.navigate(['./', configuration.pages.addToPortal, configuration.pages.shareLearningItem, this.learningItem]);
  }

  async goBack() {
    await this.router.navigate(['/' + configuration.defaultPage]);
  }
}
