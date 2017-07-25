import {ModuleWithProviders, NgModule} from "@angular/core";
import {Go1HeaderComponent} from "./goHeaderComponent/Go1HeaderComponent";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {RestClientService} from "./services/RestClientService";
import {CommonModule} from "@angular/common";
import {MomentModule} from "angular2-moment";
import {ChromeCmdHandleService} from "./chromeExtensionsCommandHandler/ChromeCmdHandleService";
import {AddToPortalChromeCommandHandler} from "./chromeExtensionsCommandHandler/IChromeCommandHandler";
import {StorageService} from "./services/StorageService";

@NgModule({
  declarations: [
    Go1HeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,
    MomentModule
  ],
  providers: [
    RestClientService,
    StorageService,
    ChromeCmdHandleService,
    AddToPortalChromeCommandHandler
  ],
  exports: [
    Go1HeaderComponent
  ]
})
export class Go1CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: Go1CoreModule,
      providers: [
        RestClientService,
        StorageService,
        ChromeCmdHandleService,
        AddToPortalChromeCommandHandler
      ]
    }
  }
}
