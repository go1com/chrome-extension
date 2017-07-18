
import {CompleteComponent} from "./complete/complete.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {LearnerDashboardComponent} from "./learner-dashboard/learner-dashboard.component";
import {PortalsComponent} from "./portals/portals.component";

import {UserLoginComponent} from "../modules/membership/userLogin/user-login.component";

import {SettingComponent} from "../modules/settings/setting/setting.component";
import {DiscussionsListComponent} from "../modules/discussions/discussionsListComponent/discussionsList.component";

let routes = [
  {
    path: '',
    component: UserLoginComponent
  },
  {
    path: 'discussions-list',
    component: DiscussionsListComponent
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
];

export default routes;
