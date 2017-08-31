import {Injectable} from "@angular/core";
import {RestClientService} from "../../go1core/services/RestClientService";
import configuration from "../../../environments/configuration";
import {StorageService} from "../../go1core/services/StorageService";

@Injectable()
export class EnrollmentService {
  private baseUrl = configuration.environment.baseApiUrl;

  constructor(private restClientService: RestClientService,
              private storageService: StorageService) {

  }

  private getCustomHeaders() {
    return {
      'Authorization': `Bearer ${ this.storageService.retrieve(configuration.constants.localStorageKeys.authentication) }`
    };
  }

  async enrollToLearningItem(learningItemId, portalId) {
    return this.restClientService.post(
      `${this.baseUrl}/${configuration.serviceUrls.enrollment}${portalId}/${learningItemId}/enrolment`,
      null,
      this.getCustomHeaders()
    );
  }

  async assignToUser(learningItemId, portalId, userId) {
    return this.restClientService.post(
      `${this.baseUrl}/${configuration.serviceUrls.enrollment}plan/${portalId}/${learningItemId}/user/USER_ID=${userId}`,
      null,
      this.getCustomHeaders()
    );
  }

  async scheduleLearningItem(learningItemId, portalId, dueDate) {
    return this.restClientService.post(
      `${this.baseUrl}/${configuration.serviceUrls.enrollment}plan/${portalId}/${learningItemId}/user/USER_ID=self`,
      {
        notify: true,
        due_date: dueDate
      },
      this.getCustomHeaders()
    );
  }

  async markEnrollmentAsCompleted(enrollmentId) {
    return this.restClientService.put(
      `${this.baseUrl}/${configuration.serviceUrls.enrollment}enrolment/${enrollmentId}`,
      {
        pass: 1,
        result: 100,
        status: "completed"
      },
      this.getCustomHeaders()
    );
  }
}
