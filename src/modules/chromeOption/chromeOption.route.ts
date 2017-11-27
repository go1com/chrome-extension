
import configuration from "../../environments/configuration";
import { ChromeOptionComponent } from "./chromeOption/chromeOption.component";

export const chromeOptionRoutes = [
  {
    path: '',
    children: [
      {path: '', component: ChromeOptionComponent}
    ]
  },
];
