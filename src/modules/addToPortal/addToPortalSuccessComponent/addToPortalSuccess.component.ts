import {Component} from "@angular/core";
import configuration from "../../../environments/configuration";
import {StorageService} from "../../go1core/services/StorageService";
import {Router} from "@angular/router";

@Component({
  selector: 'add-to-portal-success',
  templateUrl: './addToPortalSuccess.pug'
})
export class AddToPortalSuccessComponent {
  courses: any[];
  selectedCourseIds: any[];
  currentPortal: any;
  sharedToUser: null;

  constructor(private router: Router,
              private storageService: StorageService) {
    this.courses = [];
    this.selectedCourseIds = [];
  }

  async ngOnInit() {
    if (this.storageService.exists(configuration.constants.localStorageKeys.sharedLiToUser)) {
      this.sharedToUser = this.storageService.retrieve(configuration.constants.localStorageKeys.sharedLiToUser);

      window.onbeforeunload = () => {
        this.storageService.remove(configuration.constants.localStorageKeys.sharedLiToUser);
      };
    }

    this.currentPortal = this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortal);
  }

  ngOnDestroy() {
    this.storageService.remove(configuration.constants.localStorageKeys.sharedLiToUser);
  }

  viewPageOnPortal() {
    window.open(`https://${this.currentPortal.title}/p/#/app/my-teaching/resources/`, '_blank');
    window.close();
  }

  async goBack() {
    await this.router.navigate(['/' + configuration.defaultPage]);
  }
}
