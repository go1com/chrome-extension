import {Component, EventEmitter, Input, Output} from "@angular/core";
import {PortalService} from "../services/PortalService";

@Component({
  selector: 'portal-selection',
  templateUrl: './portalSelection.component.pug'
})
export class PortalSelectionComponent {
  availablePortals: any[];
  @Input() portal: any;
  @Output() portalChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private portalService: PortalService) {
    this.availablePortals = [];
  }

  async ngOnInit() {
    this.availablePortals = await this.portalService.getPortals();
  }

  onPortalChanged() {
    this.portalChange.emit(this.portal);
  }
}
