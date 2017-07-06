import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { UserLoginComponent } from './user/user-login.component';

import { UserService } from './user/user.service';
import { UserResolve } from './user/user.resolve';

import * as bootstrap from 'bootstrap';
import { HeaderComponent } from './header/header.component';
import { LearnerDashboardComponent } from './learner-dashboard/learner-dashboard.component';
import { LearnerService } from './learner-dashboard/learner.service';
import { PortalsComponent } from './portals/portals.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AutocompleteComponent } from "app/core/components/autocomplete/autocomplete.component";
import { ClickOutsideDirective } from './core/components/click-outside.directive';
import { CompleteComponent } from "app/complete/complete.component";
import { SettingComponent } from './setting/setting.component';

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    HeaderComponent,
    LearnerDashboardComponent,
    PortalsComponent,
    AdminDashboardComponent,
    CompleteComponent,
    ClickOutsideDirective,
    AutocompleteComponent,
    SettingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: '',
        component: UserLoginComponent
      },
      {
        path: 'portals',
        component: PortalsComponent
      },
      {
        path: 'learner-dashboard',
        component: LearnerDashboardComponent,
      },
      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        // resolve: {
        //   user: UserResolve
        // }
      },
      {
        path: 'complete',
        component: CompleteComponent,
      },
      {
        path: 'setting',
        component: SettingComponent
      }
    ])
  ],
  providers: [
    UserService,
    LearnerService,
    UserResolve
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
