import {SettingComponent} from "./setting/setting.component";
import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {MembershipModule} from "../membership/membership.module";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    FormsModule,
    HttpModule,
    RouterModule,

    Go1CoreModule,
    MembershipModule
  ],
  exports: [
    SettingComponent
  ]
})
export class SettingsModule {

}
