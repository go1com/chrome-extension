import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NoPreloading, PreloadAllModules, RouterModule} from '@angular/router';

import {AppComponent} from './app.component';

import {HeaderComponent} from './header/header.component';
import {LearnerDashboardComponent} from './learner-dashboard/learner-dashboard.component';
import {LearnerService} from './learner-dashboard/learner.service';
import {PortalsComponent} from './portals/portals.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {ClickOutsideDirective} from './core/components/click-outside.directive';
import {CompleteComponent} from "./complete/complete.component";
import {AutocompleteComponent} from "./core/components/autocomplete/autocomplete.component";
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
import {AddToPortalModule} from "../modules/addToPortal/addToPortal.module";
import {DiscussionsModule} from "../modules/discussions/discussions.module";


@NgModule({
  declarations: [
    AppComponent,
    RedirectingComponent,
    // HeaderComponent,
    // LearnerDashboardComponent,
    // PortalsComponent,
    // AdminDashboardComponent,
    // CompleteComponent,
    // ClickOutsideDirective,
    // AutocompleteComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes, {
      useHash: true,
      // preloadingStrategy: NoPreloading
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
