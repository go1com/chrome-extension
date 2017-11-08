import {Injectable} from "@angular/core";
import {RestClientService} from "../../go1core/services/RestClientService";
import configuration from "../../../environments/configuration";
import {StorageService} from "../../go1core/services/StorageService";


const INTERESTING = -4; // # Learner interest in the object, but no action provided yet.
const SCHEDULED = -3; // # Learner is scheduled in the object.
const ASSIGNED = -2; // # Learner self-assigned, or by someone.
const ENQUIRED = -1; // # Learner interesting in the object, enquired.
const PENDING = 0; // # The object is not yet available.
const LATE = 4; // # Learning was assigned & was not able to complete the plan ontime.
const EXPIRED = 5; // # The object is expired.

@Injectable()
export class EnrollmentService {
  private baseUrl = configuration.environment.baseApiUrl;

  constructor(private restClientService: RestClientService,
              private storageService: StorageService) {

  }

  private async getCustomHeaders() {
    return {
      'Authorization': `Bearer ${ await this.storageService.retrieve(configuration.constants.localStorageKeys.authentication) }`
    };
  }

  async enrollToLearningItem(learningItemId, portalId) {
    return this.restClientService.post(
      `${this.baseUrl}/${configuration.serviceUrls.enrollment}${portalId}/${learningItemId}/enrolment`,
      null,
      await this.getCustomHeaders()
    );
  }

  async assignToUser(learningItemId, portalId, userId) {
    return this.restClientService.post(
      `${this.baseUrl}/${configuration.serviceUrls.enrollment}plan/${portalId}/${learningItemId}/user/${userId}`,
      {
        status: ASSIGNED
      },
      await this.getCustomHeaders()
    );
  }

  async scheduleLearningItem(learningItemId, portalId, dueDate) {
    return this.restClientService.post(
      `${this.baseUrl}/${configuration.serviceUrls.enrollment}plan/${portalId}/${learningItemId}/user/self`,
      {
        notify: true,
        due_date: dueDate,
        status: SCHEDULED
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
