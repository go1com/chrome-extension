import {Inject, Component} from '@angular/core';

import {DialogRef, ModalComponent} from 'angular2-modal';
import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class AlertModalContext extends BSModalContext {
  public title: string;
  public okButtonText: string = 'OK';
  public okButtonClass: string;
}

@Component({
  selector: 'modal-content',
  templateUrl: './alertModal.tpl.pug'
})
export class AlertModalComponent implements ModalComponent<AlertModalContext> {
  context: AlertModalContext;

  constructor(@Inject(DialogRef) public dialog: DialogRef<AlertModalContext>) {
    this.context = dialog.context;
  }

  close() {
    this.dialog.close(null);
  }
}
