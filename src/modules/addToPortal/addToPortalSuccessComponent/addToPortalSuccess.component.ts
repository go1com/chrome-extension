import {Component} from "@angular/core";
import configuration from "../../../environments/configuration";
import {StorageService} from "../../go1core/services/StorageService";

@Component({
  selector: 'add-to-portal-success',
  templateUrl: '../../../views/addToPortalSuccess.pug'
})
export class AddToPortalSuccessComponent {
  courses: any[];
  selectedCourseIds: any[];
  currentPortal: any;

  constructor(private storageService: StorageService) {
    this.courses = [];
    this.selectedCourseIds = [];
  }

  async ngOnInit() {
    this.currentPortal = this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortal);
  }

  viewPageOnPortal() {
    window.open(`https://${this.currentPortal.title}/p/#/app/my-teaching/resources/`, '_blank');
    window.close();
  }
}
