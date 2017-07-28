import {Go1LinkPreviewComponent} from "../sharedComponents/go1LinkPreview/go1LinkPreviewComponent/go1LinkPreview.component";
import {ModalDialogService} from "./notifications/AlertModal";
import {Go1ExtensionInjectionArea} from "./go1ExtensionInjectionArea";

declare const $: any;

export class NewDiscussionPopup {
  containerDOM: any;
  popupDOM: any;
  linkPreview: Go1LinkPreviewComponent;
  private onDismissCallback: Function;
  static currentOpeningPopup: NewDiscussionPopup;
  private quoteText: string;

  static openPopup(containerDOM, quote?: string) {
    if (NewDiscussionPopup.currentOpeningPopup) {
      NewDiscussionPopup.currentOpeningPopup.hidePopup();
    }

    NewDiscussionPopup.currentOpeningPopup = new NewDiscussionPopup(() => {
      NewDiscussionPopup.currentOpeningPopup = null;
    });
    NewDiscussionPopup.currentOpeningPopup.showPopup(quote);
  }

  constructor(onDismissCallback: Function) {
    this.linkPreview = new Go1LinkPreviewComponent();
    this.linkPreview.linkUrl = window.location.toString();
    this.onDismissCallback = onDismissCallback;
  }

  async showPopup(quote?: string) {
    if (this.popupDOM) {
      return;
    }

    const html = require('../views/newDiscussionComponent.tpl.pug');

    this.popupDOM = $(html);
    Go1ExtensionInjectionArea.appendDOM(this.popupDOM);
    this.bindEventListeners();
    this.popupDOM.addClass('bounceIn bounceInRight');

    if (quote) {
      await this.showQuoteText(quote);
    } else {
      await this.showLinkPreview();
    }
  }

  private showQuoteText(quote: string) {
    this.quoteText = quote;

    $('.quotation blockquote', this.popupDOM).text(this.quoteText);
    $('.quotation', this.popupDOM).css('display', '');
    $('.quotation blockquote', this.popupDOM).dotdotdot();
  }

  async showLinkPreview() {
    const linkPreviewHtml = require('../views/go1LinkPreview.simpleComponent.pug');
    const linkPreviewContainer = $('.link-preview', this.popupDOM);
    const linkPreviewContent = $(linkPreviewHtml);

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

    $('.link-preview-img', loadingCompleteBlock).attr('src', this.linkPreview.linkPreview.image);
    $('.description', loadingCompleteBlock).text(this.linkPreview.linkPreview.description);
    $('h5 > .title', loadingCompleteBlock).text(this.linkPreview.linkPreview.title);

    isLoadingBlock.remove();
    loadingCompleteBlock.css({'display': ''});
  }

  bindEventListeners() {
    $('.quotation', this.popupDOM).css('display', 'none');
    $('.link-preview', this.popupDOM).css('display', 'none');
    $('.go-back-btn', this.popupDOM).on('click', (event) => this.hidePopup());
    $('.actions-area .add-note-btn', this.popupDOM).on('click', (event) => this.addNote());
  }

  async addNote() {
    let newNoteData = {
      title: this.popupDOM.find('input[name="noteTitle"]').val(),
      body: this.popupDOM.find('textarea[name="noteBody"]').val(),
      item: this.linkPreview.linkUrl,
      quote: this.quoteText || ''
    };

    if (!newNoteData.title) {
      ModalDialogService.showModal('Please enter the topic!', 'Topic missing!', 'warning', 'OK', 'warning');
      return;
    }

    chrome.runtime.sendMessage({
      from: 'content',
      action: 'addNewNote',
      data: newNoteData
    }, (response) => {
      if (response.success) {
        this.hidePopup();
        this.showSuccessPopup();
      }
    });
  }

  showSuccessPopup() {
    ModalDialogService.showModal('Note saved successfully', 'Congratulation!', 'success', '','primary', 3.5);
  }

  hidePopup() {
    this.popupDOM.removeClass('bounceIn bounceInRight');
    this.popupDOM.addClass('bounceOut bounceOutRight');

    setTimeout(() => {
      this.popupDOM.remove();
      this.onDismissCallback();
    }, 1500);
  }
}
