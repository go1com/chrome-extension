import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {routeNames} from "../addToPortal.routes";
import {AddToPortalService} from "../services/AddToPortalService";
import {commandKeys} from "../../../environments/commandKeys";
import {EnrollmentService} from "../../enrollment/services/enrollment.service";
import {UserService} from "../../membership/services/user.service";
import * as _ from 'lodash';
import {ensureChromeTabLoaded} from "../../../environments/ensureChromeTabLoaded";
import {BrowserMessagingService} from "../../go1core/services/BrowserMessagingService";

@Component({
  selector: 'add-to-portal',
  templateUrl: './addToPortal.pug'
})
export class AddToPortalComponent implements OnInit, OnDestroy {
  noteData: any;
  data: any;
  tabUrl = '';
  isLoading = false;
  linkPreview: any = null;
  addToPortalFromBackground = false;
  private pageUrl: any;
  learningItem: any;

  constructor(private router: Router,
              private addToPortalService: AddToPortalService,
              private currentActiveRoute: ActivatedRoute,
              private enrollmentService: EnrollmentService,
              private userService: UserService,
              private storageService: StorageService,
              private browserMessagingService: BrowserMessagingService) {

  }

  async ngOnInit() {
    this.isLoading = true;

    if (await this.storageService.exists(configuration.constants.localStorageKeys.addToPortalParams)) {
      const pageToCreateNote = await this.storageService.retrieve(configuration.constants.localStorageKeys.addToPortalParams);
      this.pageUrl = pageToCreateNote.url;
      this.addToPortalFromBackground = true;
      await this.storageService.remove(configuration.constants.localStorageKeys.addToPortalParams);
    } else {
      this.pageUrl = configuration.currentChromeTab && configuration.currentChromeTab.url || '';
    }

    const user = await this.storageService.retrieve(configuration.constants.localStorageKeys.user);

    this.tabUrl = this.pageUrl;

    this.linkPreview = await this.loadPageMetadata(this.pageUrl);

    this.data = {
      title: this.linkPreview.title,
      description: this.linkPreview.description,
      type: 'iframe',
      tags: [],
      data: {
        path: this.pageUrl
      },
      single_li: true,
      published: 1,
      instance: await this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId),
      author: user.mail
    };

    this.isLoading = false;
  }

  async ngOnDestroy() {
    // if (!_.isEqual(this.learningItem.tags, this.data.tags)) {
    //   await this.addToPortalService.updateLearningItem({
    //     id: this.learningItem.id,
    //     tags: this.learningItem.tags
    //   });
    // }
  }

  async onDoneBtnClicked() {
    this.learningItem = await this.addToPortal();
    await this.goToSuccess(this.learningItem.id);
  }

  async onCancelBtnClicked() {
    await this.goBack();
  }

  private async loadPageMetadata(url) {
    await ensureChromeTabLoaded();

    const response = await this.browserMessagingService.requestToTab(configuration.currentChromeTab.id, commandKeys.getLinkPreview);

    return response.data;
  }

  async addToPortal() {
    return await this.addToPortalService.addToPortal(this.data);
  }

  async goToSuccess(learningItemId) {
    await this.router.navigate(['./', configuration.pages.addToPortal, routeNames.success, learningItemId]);
  }

  goBack() {
    this.router.navigate(['/' + configuration.defaultPage]);
  }
}
