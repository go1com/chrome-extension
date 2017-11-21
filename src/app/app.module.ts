import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, PreloadAllModules} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {LearnerService} from './learner-dashboard/learner.service';
import {routes} from "./app.routes";
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
import {AddToPortalModule} from "../modules/addToPortal/addToPortal.module";
import {DiscussionsModule} from "../modules/discussions/discussions.module";

@NgModule({
  declarations: [
    AppComponent,
    RedirectingComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    }),
    NgbModule.forRoot(),
    ModalModule.forRoot(),


    TypeAheadModule.forRoot(),
    Go1CoreModule,
    SettingsModule,
    MembershipModule,
    PortalModule,
    AddToPortalModule,
    DiscussionsModule
  ],
  providers: [
    LearnerService,

    ...extraProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
