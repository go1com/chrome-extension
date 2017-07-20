import {Router} from "@angular/router";
import {Injectable} from "@angular/core";

export interface IChromeCommandHandler {
  command: string;

  setRouter(router: Router);

  handle(request: any, sender: any, sendResponse: Function);
}

@Injectable()
export class AddToPortalChromeCommandHandler implements IChromeCommandHandler {
  command = "ADD_TO_PORTAL";

  private router;

  setRouter(router: Router) {
    this.router = router;
  }

  handle(request: any, sender: any, sendResponse: Function) {
    this.router.navigate(['discussions-list/newDiscussion']);
    sendResponse({farewell: "goodbye"});
  }
}
