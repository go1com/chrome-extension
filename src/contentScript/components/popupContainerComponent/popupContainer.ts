import {IStorageService, IStorageServiceSymbol} from "../../../services/storageService/IStorageService";
import {inject, injectable} from "inversify";
import {IContentScriptComponent} from "../IContentScriptComponent";

declare const $: any;

@injectable()
export class PopupContainer implements IContentScriptComponent {
  togglePopupButton: any;
  view: any;
  popupUrl: string;
  popupClosed = true;
  popupContentIframe: any;

  constructor(@inject(IStorageServiceSymbol) private storageService: IStorageService) {
    console.log('popup container initialized');
    this.popupUrl = `chrome-extension://${chrome.runtime.id}/index.html`;
    this.view = $(require('./popupContainer.pug'));
    this.togglePopupButton = this.view.find('button#go1-popup-close-btn');
    this.popupContentIframe = this.view.find('iframe#popup-iframe');
    this.popupContentIframe.attr('src', this.popupUrl);
  }

  initialize(parentComponent: IContentScriptComponent) {
    this.view.prependTo(parentComponent.view);

    this.popupContentIframe.on('load', () => {
      this.view.addClass('finished-loading');
      this.popupContentIframe.off('load');
    });

    this.togglePopupButton.on('click', () => this.togglePopup());
  }

  togglePopup() {
    if (this.popupClosed) {
      this.showPopup();
    } else {
      this.closePopup();
    }
  }

  closePopup() {
    this.view.removeClass('slideInRight').addClass('slideOutRight');
    this.popupClosed = true;
    this.togglePopupButton.html(`<i class="fa fa-chevron-left"></i>`);
  }

  showPopup(popupPage?) {
    const popupContent = this.popupContentIframe;

    if (popupPage) {
      const url = `${this.popupUrl}#/${popupPage || ''}`;

      if (popupContent.attr('src') === url) {
        popupContent.attr('src', `${this.popupUrl}#/`);
        setTimeout(() => this.showPopup(popupPage), 100);
        return;
      }

      popupContent.attr('src', url);
    }

    this.view.addClass('slideInRight fast').removeClass('hidden slideOutRight');
    this.popupClosed = false;
    this.togglePopupButton.html(`<i class="fa fa-chevron-right"></i>`);
  }
}
