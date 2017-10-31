import {IStorageService, IStorageServiceSymbol} from "../../../services/storageService/IStorageService";
import {inject, injectable} from "inversify";
import {IContentScriptComponent} from "../IContentScriptComponent";
import {commandKeys} from "../../../environments/commandKeys";
import {ChromeMessagingService} from "../../../services/browserMessagingService/chromeMessagingService";
import {PopupContainer} from "../popupContainerComponent/popupContainer";

declare const $: any;

@injectable()
export class FabButtonsComponent implements IContentScriptComponent {
  view: any;
  private startDiscussionBtn: any;
  private addToPortalBtn: any;
  private triggerBtn: any;

  constructor(@inject(IStorageServiceSymbol) private storageService: IStorageService,
              @inject(PopupContainer) private popupContainer: PopupContainer,
              @inject(ChromeMessagingService) private chromeMessagingService: ChromeMessagingService) {
    this.view = $(require('./fabButtons.pug'));
    this.startDiscussionBtn = this.view.find('.start-discussion-btn');
    this.addToPortalBtn = this.view.find('.add-to-portal-btn');
    this.triggerBtn = this.view.find('.trigger-fab');
  }

  initialize(parentComponent: IContentScriptComponent) {
    this.view.appendTo(parentComponent.view);

    this.view.mouseleave((event) => {
      setTimeout(() => {
        this.view.removeClass('active');
      }, 3000);
    });

    this.triggerBtn.on('click', (event) => {
      this.view.addClass('active');
    });

    this.startDiscussionBtn.on('click', (event) => this._onStartDiscussionBtnClicked(event));

    this.addToPortalBtn.on('click', (event) => this._onAddToPortalBtnClicked(event));
  }

  removeComponent() {
    this.view.off('mouseleave');

    this.triggerBtn.off('click');
    this.startDiscussionBtn.off('click');
    this.addToPortalBtn.off('click');
    this.view.remove();
  }

  private async _onAddToPortalBtnClicked(event) {
    this.view.removeClass('active');

    this.popupContainer.showPopup('addToPortal/addToPortal');
  }

  private async _onStartDiscussionBtnClicked(event) {
    this.view.removeClass('active');

    await this.chromeMessagingService.requestToBackground(commandKeys.startDiscussion);
    this.popupContainer.showPopup('discussionsList/newDiscussion')
  }
}
