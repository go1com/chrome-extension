import {Go1LinkPreviewComponent} from "../sharedComponents/go1LinkPreview/go1LinkPreviewComponent/go1LinkPreview.component";
import {ModalDialogService} from "./notifications/ModalDialogService";
import {PopupBaseModel} from "./basePopup/popupBaseModel";
import {commandKeys} from "../commandHandlers/commandKeys";

declare const $: any;

export class NewDiscussionPopup extends PopupBaseModel {
  linkPreview: Go1LinkPreviewComponent;
  quoteText: string;

  constructor(quoteText?: string) {
    super();
    this.linkPreview = new Go1LinkPreviewComponent(null);
    this.linkPreview.linkUrl = window.location.toString();
    if (quoteText) {
      this.quoteText = quoteText;
    }
  }

  protected getPopupHtml() {
    return require('../views/newDiscussionComponent.tpl.pug');
  }

  protected async onPopupShown() {
    if (this.quoteText) {
      await this.showQuoteText();
    }
    await this.showLinkPreview();
  }

  protected bindEventListeners() {
    $('.quotation', this.popupDOM).css('display', 'none');
    $('.link-preview', this.popupDOM).css('display', 'none');
    $('.go-back-btn', this.popupDOM).on('click', (event) => PopupBaseModel.closeLastPopup());
    $('.actions-area .add-note-btn', this.popupDOM).on('click', (event) => this.addNote());
  }

  protected onPopupHidden() {

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
      uniqueName : `${this.linkPreview.linkUrl}__`
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
