import {Go1ExtensionInjectionArea} from "../go1ExtensionInjectionArea";

declare const $: any;

export class ModalDialogService {
  static showModal(message: string,
                   title: string = '',
                   dialogType: 'default' | 'danger' | 'warning' | 'info' | 'success' = 'default',
                   buttonText: string = '',
                   buttonStyle: 'primary' | 'danger' | 'warning' | 'info' | 'success' = 'primary',
                   autoCloseInSecond: number = 0) {

    const modalContentHtml = require('./alertModal.pug');

    const modalContent = $(modalContentHtml);

    modalContent.find('.modal-body-content').html(message);

    const closePopup = () => {
      modalContent.removeClass('fadeIn fadeInTop').addClass('fadeOut fadeOutBottom');
      setTimeout(() => {
        modalContent.remove();
      }, 1000);
    };

    if (title) {
      modalContent.find('h6#modal-title').text(title);
      modalContent.find('#modal-header').addClass(`dialog-${dialogType}`)
    } else {
      modalContent.find('#modal-header').remove();
    }

    if (!buttonText && autoCloseInSecond) {
      modalContent.find('.modal-footer').remove();
    } else {
      modalContent.find('#dismiss-btn').text(buttonText);
      modalContent.find('#dismiss-btn').addClass(`btn-${buttonStyle}`);
      modalContent.find('#dismiss-btn').on('click', () => closePopup());
    }

    Go1ExtensionInjectionArea.appendDOM(modalContent);
    modalContent.addClass('fadeIn fadeInTop');

    if (autoCloseInSecond) {
      setTimeout(() => closePopup(), autoCloseInSecond * 1000);
    }
  }
}
