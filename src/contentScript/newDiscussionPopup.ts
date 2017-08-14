import {Go1LinkPreviewComponent} from "../sharedComponents/go1LinkPreview/go1LinkPreviewComponent/go1LinkPreview.component";
import {ModalDialogService} from "./notifications/ModalDialogService";
import {PopupBaseModel} from "./basePopup/popupBaseModel";
import {commandKeys} from "../commandHandlers/commandKeys";
import {PortalService} from "../modules/portal/services/PortalService";
import {RestClientService} from "../modules/go1core/services/RestClientService";
import {StorageService} from "../modules/go1core/services/StorageService";

declare const $: any;

export class NewDiscussionPopup extends PopupBaseModel {
  linkPreview: Go1LinkPreviewComponent;
  quoteText: string;
  restClientService: RestClientService;
  storageService: StorageService;
  private portalService: PortalService;
  private portalSelectComponent: any;

  constructor(quoteText?: string) {
    super();
    this.linkPreview = new Go1LinkPreviewComponent(null);
    this.restClientService = new RestClientService();
    this.storageService = new StorageService();
    this.portalService = new PortalService(this.restClientService, this.storageService);
    this.linkPreview.linkUrl = window.location.toString();
    if (quoteText) {
      this.quoteText = quoteText;
    }
  }

  protected getPopupHtml() {
    return require('../views/newDiscussionComponent.tpl.pug');
  }

  protected async onPopupShown() {
    this.loadPortalSelector();
    if (this.quoteText) {
      await this.showQuoteText();
    }
    await this.showLinkPreview();
  }

  protected bindEventListeners() {
    $('.quotation', this.popupDOM).css('display', 'none');
    $('.link-preview', this.popupDOM).css('display', 'none');
    $('.close-popup-btn', this.popupDOM).on('click', (event) => PopupBaseModel.closeLastPopup());
    $('.actions-area .add-note-btn', this.popupDOM).on('click', (event) => this.addNote());
  }

  protected onPopupHidden() {

  }

  private async loadPortalSelector() {
    chrome.runtime.sendMessage({
      action: commandKeys.getPortals
    }, (response) => {
      const portals = response.portals;
      const defaultPortal = response.defaultPortal;
      this.portalSelectComponent = $(`<select class="form-control" ></select>`);

      portals.forEach(portal => {
        this.portalSelectComponent.append($(`<option value="${portal.id}">${portal.title}</option>`));
      });

      this.popupDOM.find('portal-selection').replaceWith(this.portalSelectComponent);
      this.portalSelectComponent.val(defaultPortal);
    });
  }

  private showQuoteText() {
    $('.quotation blockquote', this.popupDOM).text(this.quoteText);
    $('.quotation', this.popupDOM).css('display', '');
    $('.quotation blockquote', this.popupDOM).dotdotdot();
  }

  async showLinkPreview() {
    const linkPreviewContainer = $('.related-to', this.popupDOM);
    const linkPreviewContent = linkPreviewContainer;

    linkPreviewContainer.css('display', '');
    linkPreviewContainer.append(linkPreviewContent);

    let isLoadingBlock = $('.is-loading', linkPreviewContent);
    let loadingCompleteBlock = $('.loading-completed', linkPreviewContent);

    isLoadingBlock.css('display', 'block');
    loadingCompleteBlock.css('display', 'none');
    await this.linkPreview.loadLinkPreviewData();

    if (!this.linkPreview.linkPreview.image) {
      this.linkPreview.linkPreview.image = `chrome-extension://${chrome.runtime.id}/assets/no-image-icon-15.png`;
    }

    loadingCompleteBlock.find('.favicon').attr('src', this.linkPreview.linkPreview.favicon);
    loadingCompleteBlock.find('.site-domain').text(this.linkPreview.linkPreview.hostname || '');
    loadingCompleteBlock.find('.site-detail-container > h5').text(this.linkPreview.linkPreview.title);

    isLoadingBlock.remove();
    loadingCompleteBlock.css({'display': ''});
  }

  async addNote() {
    let newNoteData = {
      title: this.popupDOM.find('input[name="noteTitle"]').val() || 'Note from ' + this.linkPreview.linkPreview.title,
      body: this.popupDOM.find('textarea[name="noteBody"]').val(),
      item: this.linkPreview.linkUrl,
      quote: this.quoteText || '',
      uniqueName: `${this.linkPreview.linkUrl}__`,
      entityId: this.portalSelectComponent.val()
    };

    chrome.runtime.sendMessage({
      from: 'content',
      action: commandKeys.startDiscussion,
      data: newNoteData
    }, (response) => {
      if (response.success) {
        PopupBaseModel.closeLastPopup();
        this.showSuccessPopup();
      }
    });
  }

  showSuccessPopup() {
    ModalDialogService.showModal('Note saved successfully', 'Congratulation!', 'success', '', 'primary', 3.5);
  }
}
