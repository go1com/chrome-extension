import {StorageService} from "../../modules/go1core/services/StorageService";
import configuration from "../../environments/configuration";
import {PopupBaseModel} from "../basePopup/popupBaseModel";
import {AddToPortalSuccessPopup} from "./addToPortalSuccessPopup";
import {AddToPortalSchedulePopup} from "./addToPortalSchedulePopup";
import {commandKeys} from "../../commandHandlers/commandKeys";

declare const $: any;

export class AddToPortalPopup extends PopupBaseModel {
  storageService: StorageService;
  data: {
    title: string;
    description: string;
    type: string;
    tags: any[];
    data: {
      type: string;
      path: string;
    };
    instance: any;
  };

  constructor() {
    super();
    this.storageService = new StorageService();

    this.data = {
      title: '',
      description: '',
      type: 'resource',
      tags: [],
      data: {
        type: 'weblink',
        path: window.location.toString(),
      },
      instance: this.storageService.retrieve(configuration.constants.localStorageKeys.activeInstance)
    };
  }

  protected onPopupShown() {

  }

  protected getPopupHtml() {
    return require('../../views/addToPortal.pug');
  }

  protected bindEventListeners() {
    this.popupDOM.find('.close-btn').on('click', (event) => PopupBaseModel.closeLastPopup());
    $('.actions-area #markAsComplete', this.popupDOM).on('click', (event) => this.markAsComplete());
    $('.actions-area #saveForLater', this.popupDOM).on('click', (event) => this.saveForLater());
  }

  protected onPopupHidden() {

  }

  async markAsComplete() {
    chrome.runtime.sendMessage({
      from: 'content',
      action: commandKeys.addToPortal,
      data: this.data
    }, async (response) => {
      if (response.success) {
        this.showSuccessPopup();
      }
    });
  }

  async saveForLater() {
    this.showSchedulePopup();
  }

  async showSuccessPopup() {
    const successPopup = new AddToPortalSuccessPopup(this.data);
    await PopupBaseModel.openPopup(successPopup);
  }

  async showSchedulePopup() {
    const schedulePopup = new AddToPortalSchedulePopup(this.data);
    await PopupBaseModel.openPopup(schedulePopup);
  }
}
