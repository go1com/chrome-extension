import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {routeNames} from "../addToPortal.routes";
import {EnrollmentService} from "../../enrollment/services/enrollment.service";
import * as moment from 'moment';
import {commandKeys} from "../../../environments/commandKeys";

@Component({
  selector: 'app-learning-item-schedule',
  templateUrl: './addToPortalSchedule.pug'
})
export class LearningItemScheduleComponent {
  linkPreview: any;
  tabUrl: any;
  pageUrl: any;
  private isLoading: boolean;
  private learningItem: any;
  private scheduleDate: any;
  private scheduleTime: any;
  private scheduleDateTime = new Date();
  private portalId: any | string;

  constructor(private router: Router,
              private currentActiveRoute: ActivatedRoute,
              private storageService: StorageService,
              private enrollmentService: EnrollmentService) {
  }

  async ngOnInit() {
    this.isLoading = true;
    this.currentActiveRoute.params.subscribe(async (params) => {
      this.learningItem = params['learningItemId'];

      if (await this.storageService.exists(configuration.constants.localStorageKeys.cacheLearningItem + this.learningItem)) {
        const pageToCreateNote = await this.storageService.retrieve(configuration.constants.localStorageKeys.cacheLearningItem + this.learningItem);
        this.pageUrl = pageToCreateNote.data.path;
        await this.storageService.remove(configuration.constants.localStorageKeys.cacheLearningItem + this.learningItem);
      } else {
        this.pageUrl = configuration.currentChromeTab && configuration.currentChromeTab.url || '';
      }
    });

    this.tabUrl = this.pageUrl;

    this.linkPreview = await this.loadPageMetadata(this.pageUrl);

    this.portalId = await this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId);

    this.isLoading = false;
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

  onDateChanged() {
    this.updateScheduleDateTime();
  }

  onTimeChanged() {
    this.updateScheduleDateTime();
  }

  async save() {
    const response = await this.enrollmentService.scheduleLearningItem(this.learningItem, this.portalId, moment(this.scheduleDateTime).format(configuration.constants.momentISOFormat));
    await this.goToSuccess();
  }

  async goToSuccess() {
    await this.router.navigate(['./', configuration.pages.addToPortal, routeNames.success]);
  }

  goBack() {
    this.router.navigate(['/' + configuration.defaultPage]);
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
}
