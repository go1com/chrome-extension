import {DiscussionsListComponent} from "./discussionsListComponent/discussionsList.component";
import {NewDiscussionComponent} from "./newDiscussionComponent/newDiscussion.component";
import {DiscussionDetailComponent} from "./discussionDetailComponent/discussionDetail.component";
import configuration from "../../environments/configuration";

export const discussionModuleRoutes = [
  {
    path: '',
    children: [
      {path: '', component: DiscussionsListComponent},
      {path: configuration.pages.discussionsList, component: DiscussionsListComponent},
      {path: 'newDiscussion', component: NewDiscussionComponent},
      {path: `${configuration.pages.discussionDetail}/:discussionId`, component: DiscussionDetailComponent},
    ]
  },
];
