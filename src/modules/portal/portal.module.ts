import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {PortalService} from "./services/PortalService";

@NgModule({
  declarations: [
  ],
  imports: [
    FormsModule,
    RouterModule,
    Go1CoreModule
  ],
  providers: [
    PortalService
  ],
  exports: [

  ]
})
export class PortalModule {

}
