import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {PortalService} from "./services/PortalService";
import {PortalSelectionComponent} from "./portalSelectionComponent/portalSelection.component";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    PortalSelectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    Go1CoreModule
  ],
  providers: [
    PortalService
  ],
  exports: [
    PortalSelectionComponent
  ]
})
export class PortalModule {

}
