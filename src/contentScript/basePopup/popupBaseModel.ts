import {Go1ExtensionInjectionArea} from "../go1ExtensionInjectionArea";
import configuration from "../../environments/configuration";

declare const $: any;

export abstract class PopupBaseModel {
  popupDOM: any;
  static currentOpeningPopup: PopupBaseModel[] = [];

  static async openPopup(popupModel) {
    // PopupBaseModel.closeLastPopup();
    // let popup;
    // if (typeof popupModel === "function") {
    //   popup = new popupModel();
    // } else if (popupModel instanceof PopupBaseModel) {
    //   popup = popupModel;
    // } else {
    //   throw new Error('Parameter incorrect. The parameter must be a class or instance of PopupBaseModel');
    // }
    //
    // await popup.showPopup();
    // PopupBaseModel.currentOpeningPopup.push(popup);

    let url = `${configuration.constants.indexPage}#${configuration.pages.discussionModule}/${configuration.pages.newDiscussion}`;
    console.log('opening url: ', url);
    window.open(url, `newDiscussion`, `height=620px,width=430px`);
  }

  static closeLastPopup() {
    let lastPopup = PopupBaseModel.currentOpeningPopup.pop();

    if (lastPopup) {
      lastPopup.hidePopup();
    }
  }

  constructor() {
  }

  async showPopup() {
    if (this.popupDOM) {
      return;
    }

    const html = this.getPopupHtml();

    this.popupDOM = $(html);
    Go1ExtensionInjectionArea.appendDOM(this.popupDOM);
    this.bindEventListeners();
    this.popupDOM.addClass('bounceIn bounceInRight');
    this.onPopupShown();
  }

  private hidePopup() {
    this.popupDOM.removeClass('bounceIn bounceInRight');
    this.popupDOM.addClass('bounceOut bounceOutRight');

    setTimeout(() => {
      this.popupDOM.remove();
      this.onPopupHidden();
    }, 1500);
  }

  protected abstract bindEventListeners() ;

  protected abstract getPopupHtml();

  protected abstract onPopupShown();

  protected abstract onPopupHidden();
}
