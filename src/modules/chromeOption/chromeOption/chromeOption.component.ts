import { Component, OnInit } from "@angular/core";
import { StorageService } from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import { ModalDialogService } from "../../go1core/services/ModalDialogService";
import * as _ from 'lodash';

const keyCode = {
  ENTER: 13
};

@Component({
  selector: 'chrome-option',
  templateUrl: './chromeOption.component.pug'
})
export class ChromeOptionComponent implements OnInit {
  versionInfo: string = configuration.version;
  private ignoredDomains: any[];

  constructor(private storageService: StorageService,
    private modalDialogService: ModalDialogService) {

  }

  async ngOnInit() {
    await this.reloadIgnoredDomains();
  }

  addDomain() {
    this.ignoredDomains.push({
      domain: ''
    });
  }

  removeDomain(domain) {
    this.ignoredDomains = _.without(this.ignoredDomains, domain);
  }

  domainInputKeyUp($event) {
    if ($event.keyCode === keyCode.ENTER) {
      this.addDomain();
    }
  }

  async save() {
    const ignoredDomains = this.ignoredDomains.map(item => item.domain).filter(domain => !!domain);

    await this.storageService.store(configuration.constants.localStorageKeys.ignoredDomains, ignoredDomains);

    await this.modalDialogService.showAlert(`Ignored Domains have been saved successfully.`);

    await this.reloadIgnoredDomains();
  }

  private async reloadIgnoredDomains() {
    const ignoredDomains = await this.storageService.retrieve(configuration.constants.localStorageKeys.ignoredDomains) || [];

    this.ignoredDomains = ignoredDomains.map(item => {
      return {
        domain: item
      };
    });
  }
}
