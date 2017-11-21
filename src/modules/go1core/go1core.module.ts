import {ModuleWithProviders, NgModule} from "@angular/core";
import {Go1HeaderComponent} from "./goHeaderComponent/Go1HeaderComponent";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {RestClientService} from "./services/RestClientService";
import {CommonModule} from "@angular/common";
import {MomentModule} from "angular2-moment";
import {StorageService} from "./services/StorageService";
import {LoadingIndicatorComponent} from "./loadingIndicatorComponent/loadingIndicatorComponent";
import {ImageSvgDirective} from "./imageSvgComponent/ImageSvgDirective";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ModalDialogService} from "./services/ModalDialogService";
import {ConfirmationModalComponent} from "./components/confirmationModal/ConfirmationModalComponent";
import {AlertModalComponent} from "./components/alertModal/AlertModalComponent";
import {BootstrapModalModule} from "ngx-modialog/plugins/bootstrap";
import {ModalModule} from "ngx-modialog";
import {AutofocusDirective} from "./autofocus-directive/autofocus.directive";
import {EllipsisPipe, EllipsisService} from "./ellipsis-pipe/ellipsis.pipe";
import {ImageFallbackDirective} from "./imageFallbackDirective/imageFallback.directive";
import {BrowserMessagingService} from "./services/BrowserMessagingService";

@NgModule({
  declarations: [
    Go1HeaderComponent,
    LoadingIndicatorComponent,
    ConfirmationModalComponent,
    AlertModalComponent,

    ImageSvgDirective,
    AutofocusDirective,
    ImageFallbackDirective,

    EllipsisPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    BootstrapModalModule,

    MomentModule
  ],
  providers: [
    RestClientService,
    StorageService,
    ModalDialogService,
    BrowserMessagingService,
    EllipsisService
  ],
  exports: [
    Go1HeaderComponent,
    LoadingIndicatorComponent,
    ConfirmationModalComponent,
    AlertModalComponent,

    ImageSvgDirective,
    AutofocusDirective,
    ImageFallbackDirective,

    EllipsisPipe
  ],
  entryComponents: [
    ConfirmationModalComponent,
    AlertModalComponent
  ]
})
export class Go1CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: Go1CoreModule,
      providers: [
        RestClientService,
        StorageService,
        ModalDialogService,
        BrowserMessagingService,
        EllipsisService
      ]
    }
  }
}
