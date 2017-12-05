import { RestClientService } from "../../go1core/services/RestClientService";
import { Injectable } from "@angular/core";
import { StorageService } from "../../go1core/services/StorageService";
import { SharedPortalService } from "../../../services/portalService/PortalService";

@Injectable()
export class PortalService extends SharedPortalService {
  constructor(protected restClientService: RestClientService,
              protected storageService: StorageService) {
    super(restClientService, storageService);
  }
}
