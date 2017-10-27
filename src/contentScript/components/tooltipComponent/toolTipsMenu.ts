import iocContainer from "../../../ioc/ioc.config";
import {commandKeys} from "../../../environments/commandKeys";
import {inject, injectable} from "inversify";
import {IContentScriptComponent} from "../IContentScriptComponent";
import {PopupContainer} from "../popupContainerComponent/popupContainer";
import {
  IBrowserMessagingService,
  IBrowserMessagingServiceSymbol
} from "../../../services/browserMessagingService/IBrowserMessagingService";

declare const $: any;

@injectable()
export class ToolTipMenu implements IContentScriptComponent {
  static toolTipMenus: any[] = [];

  selectingText: any;
  view: any;
  createNoteCmd: any;

  top: number;
  left: number;
  elementWidth: number;
  elementHeight: number;
  quotationPosition: string;


  static initializeTooltip(parentComponent: IContentScriptComponent, boundingRect, selectingText, xpathOfNode) {

    ToolTipMenu.closeLastTooltip(true);

    const toolTip = iocContainer.get<ToolTipMenu>(ToolTipMenu);

    ToolTipMenu.toolTipMenus.push(toolTip);

    toolTip.initialize(parentComponent, boundingRect, selectingText, xpathOfNode);
  }

  static closeLastTooltip(closeImmediately = false) {
    const currentTooltip = ToolTipMenu.toolTipMenus.pop();
    if (currentTooltip) {
      currentTooltip.dismiss(closeImmediately);
    }
  }

  constructor(@inject(PopupContainer) private popupContainer: PopupContainer,
              @inject(IBrowserMessagingServiceSymbol) private browserMessagingService: IBrowserMessagingService) {
    this.view = $(require('./selectionToolTipMenu.pug'));
    this.createNoteCmd = $(this.view).find('a.create-note-cmd');
  }

  initialize(parentComponent: IContentScriptComponent, boundingRect, selectingText, quotationPosition) {
    this.top = boundingRect.top;
    this.left = boundingRect.left;
    this.elementWidth = boundingRect.width;
    this.elementHeight = boundingRect.height;

    this.selectingText = selectingText;
    this.quotationPosition = quotationPosition;

    this.view.appendTo(parentComponent.view);

    this.view.css({
      left: this.left + (this.elementWidth / 2) + 'px',
      top: this.top + window.scrollY - 32 + 'px'
    });

    this.view.addClass('fadeIn fadeInBottom');
    this.bindEventListeners();
  }

  dismiss(closeImmediately = false) {
    if (closeImmediately) {
      this._disposeComponent();
      return;
    }

    this.view.removeClass('fadeIn fadeInBottom');
    this.view.addClass('fadeOut fadeOutBottom');
    setTimeout(() => {
      this._disposeComponent();
    }, 1500);
  }

  _disposeComponent() {
    this.createNoteCmd.off('click');
    this.view.remove();
  }

  private bindEventListeners() {
    this.createNoteCmd.on('click', async () => {
      await this.browserMessagingService.requestToBackground(commandKeys.startDiscussion, {
        quotation: this.selectingText,
        quotationPosition: this.quotationPosition
      });

      this.popupContainer.showPopup('discussionsList/newDiscussion');

      this.dismiss();
    });
  }
}
