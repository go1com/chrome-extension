import {AddToPortalSuccessComponent} from "./addToPortalSuccessComponent/addToPortalSuccess.component";
import {AddToPortalComponent} from "./addToPortalComponent/AddToPortal.component";
import {LearningItemScheduleComponent} from "./saveForLaterComponent/learningItemSchedule.component";

export const routeNames = {
  defaultPage: '',
  saveForLater: 'saveForLater',
  success: 'success'
};

export const AddToPortalRoutes = [
  {
    path: '',
    children: [
      {path: '', component: AddToPortalComponent},
      {path: 'saveForLater', component: LearningItemScheduleComponent},
      {path: 'success', component: AddToPortalSuccessComponent}
    ]
  },
]
