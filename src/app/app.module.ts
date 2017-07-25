import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

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
import {environment} from "../environments/environment";
import {AngularFireModule} from "angularfire2";
import extraProviders from "./extraProviders";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LearnerDashboardComponent,
    PortalsComponent,
    AdminDashboardComponent,
    CompleteComponent,
    ClickOutsideDirective,
    AutocompleteComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),

    Go1CoreModule,
    SettingsModule,
    MembershipModule
  ],
  providers: [
    LearnerService,

    ...extraProviders
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
