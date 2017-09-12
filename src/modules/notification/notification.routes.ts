
import {Routes} from "@angular/router";
import {NotificationComponent} from "./notificationComponent/notification.component";

let notificationRoutes: Routes = [
  {
    path: '',
    children: [
      {path: 'notifications', component: NotificationComponent}
    ]
  },
];

export default notificationRoutes;
