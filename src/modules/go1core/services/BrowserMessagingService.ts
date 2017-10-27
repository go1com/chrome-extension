import {Injectable} from "@angular/core";
import {ChromeMessagingService} from "../../../services/browserMessagingService/chromeMessagingService";

@Injectable()
export class BrowserMessagingService extends ChromeMessagingService {
  constructor() {
    super();
  }
}
