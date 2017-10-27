import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {PreloadAllModules, RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {LearnerService} from './learner-dashboard/learner.service';
import routes from "./app.routes";
import {Go1CoreModule} from "../modules/go1core/go1core.module";
import {SettingsModule} from "../modules/settings/settings.module";
import {MembershipModule} from "../modules/membership/membership.module";
import {CommonModule} from "@angular/common";
import extraProviders from "./extraProviders";
import {PortalModule} from "../modules/portal/portal.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ModalModule} from "ngx-modialog";
import {RedirectingComponent} from "./redirectingComponent/redirecting.component";
import {TypeAheadModule} from "../sharedComponents/typeahead-plugin/typeahead.module";

@NgModule({
  declarations: [
    AppComponent,
    RedirectingComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules
    }),
    NgbModule.forRoot(),
    ModalModule.forRoot(),


    TypeAheadModule.forRoot(),
    Go1CoreModule,
    SettingsModule,
    MembershipModule,
    PortalModule,
  ],
  providers: [
    LearnerService,

    ...extraProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
