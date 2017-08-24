import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {routeNames} from "../addToPortal.routes";
import {AddToPortalService} from "../services/AddToPortalService";
import {commandKeys} from "../../../commandHandlers/commandKeys";
import {EnrollmentService} from "../../enrollment/services/enrollment.service";
import {DiscussionService} from "../../discussions/services/discussion.service";
import {UserService} from "../../membership/services/user.service";

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

    const user = await this.userService.getUser();

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

    this.isLoading = false;

    if (this.addToPortalFromBackground) {
      window.onbeforeunload = () => {
        this.storageService.remove(configuration.constants.localStorageKeys.addToPortalParams);
      };
    }
  }

  async ngOnDestroy() {
    this.storageService.remove(configuration.constants.localStorageKeys.addToPortalParams);
  }

  async onAddToPortalBtnClicked() {
    const learningItem = await this.addToPortal();

    await this.goToSuccess();
  }

  async onMarkAsCompleteBtnClicked() {
    const learningItem = await this.addToPortal();
    await this.markAsComplete(learningItem);
    await this.goToSuccess();
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

  async addAndEnroll() {
    const learningItem = await this.addToPortal();
    await this.enrollToItem(learningItem.id);
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
