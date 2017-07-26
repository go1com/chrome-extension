import {Go1LinkPreviewComponent} from "../sharedComponents/go1LinkPreview/go1LinkPreviewComponent/go1LinkPreview.component";

export class NewDiscussionPopup {
  containerDOM: any;
  popupDOM: any;
  linkPreview: Go1LinkPreviewComponent;
  private onDismissCallback: Function;

  constructor(parentNode, onDismissCallback: Function) {
    this.containerDOM = parentNode;
    this.linkPreview = new Go1LinkPreviewComponent();
    this.linkPreview.linkUrl = window.location.toString();
    this.onDismissCallback = onDismissCallback;
  }

  async showPopup() {
    if (this.popupDOM) {
      return;
    }

    const html = require('../views/newDiscussionComponent.tpl.pug');
    this.containerDOM.insertAdjacentHTML('beforeend', html);
    this.popupDOM = this.containerDOM.querySelector('.new-discussion-page');
    this.bindEventListeners();
    this.popupDOM.classList.add('bounceIn');
    this.popupDOM.classList.add('bounceInRight');
    await this.showLinkPreview();
  }

  async showLinkPreview() {
    const linkPreviewHtml = require('../views/go1LinkPreview.simpleComponent.pug');
    const linkPreviewContainer = this.popupDOM.querySelector('go1-link-preview');

    linkPreviewContainer.innerHTML = linkPreviewHtml;
    let isLoadingBlock = linkPreviewContainer.querySelector('.is-loading');
    let loadingCompleteBlock = linkPreviewContainer.querySelector('.loading-completed');

    isLoadingBlock.style.display = 'block';
    loadingCompleteBlock.style.display = 'none';
    await this.linkPreview.loadLinkPreviewData();
    if (!this.linkPreview.linkPreview.image) {
      this.linkPreview.linkPreview.image = `chrome-extension://${chrome.runtime.id}/assets/no-image-icon-15.png`;
    }
    isLoadingBlock.style.display = 'none';
    loadingCompleteBlock.querySelector('.link-preview-img').src = this.linkPreview.linkPreview.image;
    loadingCompleteBlock.querySelector('.description').innerText = this.linkPreview.linkPreview.description;
    loadingCompleteBlock.querySelector('h5 > .title').innerText = this.linkPreview.linkPreview.title;
    loadingCompleteBlock.style.removeProperty('display');
  }

  bindEventListeners() {
    this.popupDOM.querySelector('.go-back-btn').addEventListener('click', (event) => this.hidePopup());
    this.popupDOM.querySelector('.actions-area .add-note-btn').addEventListener('click', (event) => this.addNote());
  }

  async addNote() {
    let newNoteData = {
      title: this.popupDOM.querySelector('input[name="noteTitle"]').value,
      body: this.popupDOM.querySelector('textarea[name="noteBody"]').value,
      item: this.linkPreview.linkUrl
    };

    chrome.runtime.sendMessage({
      from: 'content',
      action: 'addNewNote',
      data: newNoteData
    }, (response) => {
      if (response.success) {
        this.hidePopup();
      }
    });
  }

  showSuccessPopup() {
    const html = require('../views/newDiscussionAddedSuccess.pug');
    this.containerDOM.insertAdjacentHTML('beforeend', html);
    const notificationDOM = this.containerDOM.querySelector('.discussion-added-success');
    notificationDOM.classList.add('bounceIn');
    notificationDOM.classList.add('bounceInRight');

    setTimeout(() => {
      notificationDOM.classList.remove('boundIn');
      notificationDOM.classList.remove('boundInRight');
      notificationDOM.classList.add('bounceOut');
      notificationDOM.classList.add('bounceOutRight');
      setTimeout(() => {
        this.containerDOM.removeChild(notificationDOM);
      }, 2000);
    }, 4000);
  }

  hidePopup() {
    this.popupDOM.classList.remove('bounceIn');
    this.popupDOM.classList.remove('bounceInRight');
    this.popupDOM.classList.add('bounceOut');
    this.popupDOM.classList.add('bounceOutRight');
    this.showSuccessPopup();

    setTimeout(() => {
      this.containerDOM.removeChild(this.popupDOM);
      this.onDismissCallback();
    }, 300);
  }
}
