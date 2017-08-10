import {SettingComponent} from "./setting/setting.component";
import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {MembershipModule} from "../membership/membership.module";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {PortalModule} from "../portal/portal.module";

@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    Go1CoreModule,
    PortalModule,
    MembershipModule
  ],
  exports: [
    SettingComponent
  ]
})
export class SettingsModule {

}
