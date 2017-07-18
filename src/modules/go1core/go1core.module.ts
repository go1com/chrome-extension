import {ModuleWithProviders, NgModule} from "@angular/core";
import {Go1HeaderComponent} from "./goHeaderComponent/Go1HeaderComponent";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {RestClientService} from "./services/RestClientService";

@NgModule({
  declarations: [
    Go1HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule
  ],
  providers: [
    RestClientService
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
        RestClientService
      ]
    }
  }
}
