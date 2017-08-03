import {Inject, Component} from '@angular/core';

import {DialogRef, ModalComponent} from 'angular2-modal';
import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class ConfirmationModalContext extends BSModalContext {
  public title: string;
  public yesButtonText: string = 'Yes';
  public noButtonText: string = 'No';
  public yesButtonClass: string;
}

@Component({
  selector: 'modal-content',
  templateUrl: './confirmationModal.tpl.pug'
})
export class ConfirmationModalComponent implements ModalComponent<ConfirmationModalContext> {
  context: ConfirmationModalContext;

  constructor(@Inject(DialogRef) public dialog: DialogRef<ConfirmationModalContext>) {
    this.context = dialog.context;
  }

  close(answer: boolean) {
    this.dialog.close(answer);
  }
}
