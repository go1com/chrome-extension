import {DiscussionsListComponent} from "./discussionsListComponent/discussionsList.component";
import {NewDiscussionComponent} from "./newDiscussionComponent/newDiscussion.component";

export const discussionModuleRoutes = [
  {
    path: '',
    children: [
      {path: '', component: DiscussionsListComponent},
      {path: 'newDiscussion', component: NewDiscussionComponent}
    ]
  },
];
