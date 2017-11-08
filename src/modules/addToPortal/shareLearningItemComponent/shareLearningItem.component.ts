import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {routeNames} from "../addToPortal.routes";
import {AddToPortalService} from "../services/AddToPortalService";
import {commandKeys} from "../../../environments/commandKeys";
import {EnrollmentService} from "../../enrollment/services/enrollment.service";
import {UserService} from "../../membership/services/user.service";

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
              private storageService: StorageService) {

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

    this.portalId = await this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId);

    this.tabUrl = this.pageUrl;

    this.linkPreview = await this.loadPageMetadata(this.pageUrl);

    this.shareToUser = null;

    this.isLoading = false;
  }

  async ngOnDestroy() {
    await this.storageService.remove(configuration.constants.localStorageKeys.cacheLearningItem + this.learningItem);
  }

  async shareBtnClicked() {
    await this.enrollmentService.assignToUser(this.learningItem, this.portalId, this.shareToUser.rootId);
    await this.goToSuccess();
  }

  cancelBtnClicked() {
    this.goBack();
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

  async goToSuccess() {
    this.storageService.store(configuration.constants.localStorageKeys.sharedLiToUser, this.shareToUser);
    await this.router.navigate(['./', configuration.pages.addToPortal, routeNames.success]);
  }

  goBack() {
    this.router.navigate(['/' + configuration.defaultPage]);
  }
}
