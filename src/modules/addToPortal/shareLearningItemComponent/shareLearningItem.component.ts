import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {routeNames} from "../addToPortal.routes";
import {AddToPortalService} from "../services/AddToPortalService";
import {commandKeys} from "../../../environments/commandKeys";
import {EnrollmentService} from "../../enrollment/services/enrollment.service";
import {UserService} from "../../membership/services/user.service";
import * as moment from 'moment';
import {ensureChromeTabLoaded} from "../../../environments/ensureChromeTabLoaded";
import {BrowserMessagingService} from "../../go1core/services/BrowserMessagingService";


@Component({
  selector: 'app-share-learning-item',
  templateUrl: './shareLearningItem.pug'
})
export class ShareLearningItemComponent implements OnInit, OnDestroy {
  shareToUser: any;
  data: any;
  tabUrl: string = '';
  isLoading: boolean = false;
  linkPreview: any = null;
  private pageUrl: any;
  learningItem: any;

  autoCompleteTimeout: any;
  private scheduleDate: any;
  private scheduleTime: any;
  private scheduleDateTime = new Date();

  typeAheadSetup: any = {
    customTemplate: '<div> {{ item.name }} ({{ item.mail }})</div>',
    placeHolder: 'Select User',
    textProperty: 'name',
    valueProperty: 'rootId',
    searchProperty: 'name',
    onSelect: (selectedItem: any) => {
      this.shareToUser = selectedItem;
    },
    asynchDataCall: async (value: string, cb: any) => {
      if (this.autoCompleteTimeout)
        clearTimeout(this.autoCompleteTimeout);

      this.autoCompleteTimeout = setTimeout(async () => {
        const response = await this.userService.getUserAutoComplete(value);
        cb(response);
      }, 300);
    },
  };

  private portalId: any | any | string;

  constructor(private router: Router,
              private currentActiveRoute: ActivatedRoute,
              private addToPortalService: AddToPortalService,
              private enrollmentService: EnrollmentService,
              private userService: UserService,
              private storageService: StorageService,
              private browserMessagingService: BrowserMessagingService) {

  }

  async ngOnInit() {
    this.isLoading = true;
    this.currentActiveRoute.params.subscribe(async (params) => {
      this.learningItem = params['learningItemId'];

      this.portalId = await this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId);

      this.linkPreview = await this.loadPageMetadata();

      this.shareToUser = null;

      this.isLoading = false;
    });
  }

  async ngOnDestroy() {
  }

  async shareBtnClicked() {
    await this.enrollmentService.assignToUser(this.learningItem, this.portalId, this.shareToUser.rootId);
    await this.enrollmentService.scheduleLearningItem(this.learningItem, this.portalId, moment(this.scheduleDateTime).format(configuration.constants.momentISOFormat));

    await this.goToSuccess();
  }

  cancelBtnClicked() {
    this.goBack();
  }

  onDateChanged() {
    this.updateScheduleDateTime();
  }

  onTimeChanged() {
    this.updateScheduleDateTime();
  }

  private async loadPageMetadata() {
    await ensureChromeTabLoaded();

    const response = await this.browserMessagingService.requestToTab(configuration.currentChromeTab.id, commandKeys.getLinkPreview);

    return response.data;
  }

  private updateScheduleDateTime() {
    this.scheduleDate = this.scheduleDate || {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDay()
    };

    this.scheduleTime = this.scheduleTime || {
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
      second: 0
    };

    this.scheduleDateTime = moment(`${this.scheduleDate.year}/${this.scheduleDate.month}/${this.scheduleDate.day} ${this.scheduleTime.hour}:${this.scheduleTime.minute}:${this.scheduleTime.second}`).toDate();
  }

  async goToSuccess() {
    this.storageService.store(configuration.constants.localStorageKeys.sharedLiToUser, this.shareToUser);
    await this.router.navigate(['./', configuration.pages.addToPortal, routeNames.success]);
  }

  goBack() {
    this.router.navigate(['/' + configuration.defaultPage]);
  }
}
