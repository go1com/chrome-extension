import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {routeNames} from "../addToPortal.routes";
import {AddToPortalService} from "../services/AddToPortalService";
import {commandKeys} from "../../../commandHandlers/commandKeys";
import {EnrollmentService} from "../../enrollment/services/enrollment.service";
import {UserService} from "../../membership/services/user.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'share-learning-item',
  templateUrl: './shareLearningItem.pug'
})
export class ShareLearningItemComponent {
  shareToUser: any;
  noteData: any;
  data: any;
  tabUrl: string = '';
  isLoading: boolean = false;
  linkPreview: any = null;
  addToPortalFromBackground: boolean = false;
  private pageUrl: any;
  learningItem: any;

  constructor(private router: Router,
              private currentActiveRoute: ActivatedRoute,
              private addToPortalService: AddToPortalService,
              private enrollmentService: EnrollmentService,
              private userService: UserService,
              private storageService: StorageService) {

  }

  async ngOnInit() {
    this.currentActiveRoute.params.subscribe(params => {
      console.log(params);
      this.learningItem = params['learningItemId'];
    });

    this.isLoading = true;

    this.tabUrl = this.pageUrl;

    this.linkPreview = await this.loadPageMetadata(this.pageUrl);

    this.shareToUser = null;
  }

  async ngOnDestroy() {
  }

  async shareBtnClicked() {

    await this.goToSuccess();
  }

  cancelBtnClicked() {
    this.goBack();
  }

  searchForUser = (query) => {
    if (query === '') {
      return Observable.of([]);
    }

    return Observable.create(observer => {
      this.userService.getUserAutoComplete(query)
        .then(response => {
          observer.next(response);
        })
    });
  }

  formatUserSelection = (userObj) => {
    console.log(userObj);
    return userObj.mail;
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
