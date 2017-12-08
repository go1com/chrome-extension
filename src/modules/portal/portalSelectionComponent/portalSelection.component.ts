import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PortalService } from "../services/PortalService";
import { commandKeys } from "../../../environments/commandKeys";
import { BrowserMessagingService } from "../../go1core/services/BrowserMessagingService";

@Component({
             selector: 'portal-selection',
             templateUrl: './portalSelection.component.pug'
           })
export class PortalSelectionComponent implements OnInit {
  availablePortals: any[];
  @Input() portal: any;
  @Input() disabled: boolean;

  @Output() portalChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() placeholder = "Select Portal";

  constructor(private portalService: PortalService, private messagingService: BrowserMessagingService) {
    this.availablePortals = [];
  }

  async ngOnInit() {
    this.availablePortals = await this.portalService.getPortals();
  }

  async onPortalChanged() {
    await this.portalChange.emit(this.portal);

    setTimeout(() => this.messagingService.requestToBackground(commandKeys.portalInstanceChanged), 1500);
  }
}
