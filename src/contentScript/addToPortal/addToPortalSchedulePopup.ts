import {StorageService} from "../../modules/go1core/services/StorageService";
import configuration from "../../environments/configuration";
import {PopupBaseModel} from "../basePopup/popupBaseModel";
import {commandKeys} from "../../commandHandlers/commandKeys";
import {AddToPortalSuccessPopup} from "./addToPortalSuccessPopup";

declare const $: any;

export class AddToPortalSchedulePopup extends PopupBaseModel {
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

  constructor(data?: any) {
    super();
    this.storageService = new StorageService();

    if (data) {
      this.data = data;
    } else {
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
  }

  protected onPopupShown() {

  }

  protected getPopupHtml() {
    return require('../../views/addToPortalSchedule.pug');
  }

  protected bindEventListeners() {
    this.popupDOM.find('.courses-list').css('display', 'none');
    this.popupDOM.find('.close-btn').on('click', (event) => PopupBaseModel.closeLastPopup());
    this.popupDOM.find('#saveForLater').on('click', (event) => this.saveForLater());
  }

  protected onPopupHidden() {

  }

  async saveForLater() {
    chrome.runtime.sendMessage({
      from: 'content',
      action: commandKeys.addToPortalSchedule,
      data: this.data
    }, async (response) => {
      if (response.success) {
        this.showSuccessPopup();
      }
    });
  }

  async showSuccessPopup() {
    const successPopup = new AddToPortalSuccessPopup(this.data);
    await PopupBaseModel.openPopup(successPopup);
  }
}
