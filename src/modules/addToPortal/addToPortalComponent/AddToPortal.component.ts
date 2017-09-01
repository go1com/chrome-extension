import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {routeNames} from "../addToPortal.routes";
import {AddToPortalService} from "../services/AddToPortalService";
import {commandKeys} from "../../../commandHandlers/commandKeys";
import {EnrollmentService} from "../../enrollment/services/enrollment.service";
import {UserService} from "../../membership/services/user.service";
import * as _ from 'lodash';

@Component({
  selector: 'add-to-portal',
  templateUrl: './addToPortal.pug'
})
export class AddToPortalComponent {
  noteData: any;
  data: any;
  tabUrl: string = '';
  isLoading: boolean = false;
  linkPreview: any = null;
  addToPortalFromBackground: boolean = false;
  private pageUrl: any;
  learningItem: any;

  constructor(private router: Router,
              private addToPortalService: AddToPortalService,
              private currentActiveRoute: ActivatedRoute,
              private enrollmentService: EnrollmentService,
              private userService: UserService,
              private storageService: StorageService) {

    if (this.storageService.exists(configuration.constants.localStorageKeys.addToPortalParams)) {
      const pageToCreateNote = this.storageService.retrieve(configuration.constants.localStorageKeys.addToPortalParams);
      this.pageUrl = pageToCreateNote.url;
      this.addToPortalFromBackground = true;
    } else {
      this.pageUrl = configuration.currentChromeTab && configuration.currentChromeTab.url || '';
    }

    this.data = {
      title: '',
      description: '',
      type: 'iframe',
      tags: [],
      data: {
        path: ''
      },
      single_li: true,
      published: 1,
      instance: this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId),
      author: this.storageService.retrieve(configuration.constants.localStorageKeys.user).mail
    };
  }

  async ngOnInit() {
    this.isLoading = true;

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
      instance: this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId),
      author: this.storageService.retrieve(configuration.constants.localStorageKeys.user).mail
    };

    if (this.addToPortalFromBackground) {
      window.onbeforeunload = () => {
        this.storageService.remove(configuration.constants.localStorageKeys.addToPortalParams);
      };
    }

    this.learningItem = await this.addToPortal();

    this.isLoading = false;
  }

  async ngOnDestroy() {
    if (!_.isEqual(this.learningItem.tags, this.data.tags)) {
      await this.addToPortalService.updateLearningItem({
        id: this.learningItem.id,
        tags: this.learningItem.tags
      });
    }
    this.storageService.remove(configuration.constants.localStorageKeys.addToPortalParams);
  }

  async shareButtonClicked() {
    this.storageService.store(configuration.constants.localStorageKeys.cacheLearningItem + this.learningItem.id, this.learningItem);
    await this.router.navigate(['./', configuration.pages.addToPortal, configuration.pages.shareLearningItem, this.learningItem.id]);
  }

  async onMarkAsCompleteBtnClicked() {
    await this.markAsComplete(this.learningItem);
    await this.goToSuccess();
  }

  async saveForLaterClicked() {

  }

  async markAsComplete(learningItem) {
    const enrollmentResponse: any = await this.enrollToItem(learningItem.id);

    const markAsCompleteEnrollment = await this.enrollmentService.markEnrollmentAsCompleted(enrollmentResponse.id);
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

  async addToPortal() {
    return await this.addToPortalService.addToPortal(this.data);
  }

  async enrollToItem(learningItemId) {
    return await this.enrollmentService.enrollToLearningItem(learningItemId, this.data.instance);
  }

  async goToSuccess() {
    await this.router.navigate(['./', configuration.pages.addToPortal, routeNames.success]);
  }

  goBack() {
    this.router.navigate(['/' + configuration.defaultPage]);
  }

  async saveForLater() {
    await this.router.navigate(['./' + routeNames.saveForLater], {relativeTo: this.currentActiveRoute});
  }
}
