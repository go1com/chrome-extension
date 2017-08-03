import {Inject, Injectable, ViewContainerRef} from "@angular/core";
import {Modal} from "angular2-modal/plugins/bootstrap";
import {overlayConfigFactory, Overlay} from "angular2-modal";
import {AlertModalComponent, AlertModalContext} from "../components/alertModal/AlertModalComponent";
import {
  ConfirmationModalComponent,
  ConfirmationModalContext
} from "../components/confirmationModal/ConfirmationModalComponent";

@Injectable()
export class ModalDialogService {
  static modalViewContainer: ViewContainerRef;

  constructor(@Inject(Modal) private modal: Modal,
              @Inject(Overlay) private overlay: Overlay) {

  }

  showAlert(message: string, title: string = '', okBtnText: string = 'OK', okBtnClass: string = ''): Promise<any> {
    this.ensureOverlayViewContainer();

    return this.showWindow(AlertModalComponent, {
      message: message,
      title: title,
      okButtonText: okBtnText,
      okButtonClass: okBtnClass,
    }, AlertModalContext);
  }

  showConfirmation(message: string, title: string = '', yesBtnText: string = 'Yes', noBtnText: string = 'No', yesBtnClass: string = ''): Promise<boolean> {
    this.ensureOverlayViewContainer();

    return this.showWindow<boolean>(ConfirmationModalComponent, {
      message: message,
      title: title,
      yesButtonText: yesBtnText,
      yesButtonClass: yesBtnClass,
      noButtonText: noBtnText
    }, ConfirmationModalContext);
  }

  showWindow<T>(component: any, resolveObject: any = {}, componentContext: any): Promise<T> | Promise<any> {

    this.ensureOverlayViewContainer();
    return new Promise((resolve, reject) => {
      this.modal.open(component, overlayConfigFactory(resolveObject || {}, componentContext))
        .then(dialog => {
          dialog.result.then((_closeResult: T | any) => {
            resolve(_closeResult);
          });
        });
    });
  }

  setViewContainer(vcRef: ViewContainerRef) {
    ModalDialogService.modalViewContainer = vcRef;
  }

  private ensureOverlayViewContainer() {
    if (!this.overlay.defaultViewContainer)
      this.overlay.defaultViewContainer = ModalDialogService.modalViewContainer;
  };
}
