import {Injectable} from "@angular/core";
import {RestClientService} from "../../go1core/services/RestClientService";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";

@Injectable()
export class DiscussionNoFirebaseServiceService {
  protected baseUrl = configuration.environment.baseApiUrl;

  constructor(protected restClientService: RestClientService,
              protected storageService: StorageService) {
  }

  protected getCustomHeaders() {
    return {
      'Authorization': `Bearer ${ this.storageService.retrieve(configuration.constants.localStorageKeys.authentication) }`
    };
  }

  getUserNotesFromService(contextUrl?: string) {
    let url = `${this.baseUrl}/${configuration.serviceUrls.noteService}notes`;

    const queries = [];

    queries.push(`type=${configuration.constants.noteChromeExtType}`);

    if (contextUrl) {
      queries.push(`context[url]=${contextUrl}`);
    } else if (configuration.currentChromeTab && configuration.currentChromeTab.url) {
      queries.push(`context[url]=${configuration.currentChromeTab.url}`);
    }

    if (queries.length) {
      url += `?${queries.join('&')}`;
    }

    return this.restClientService.get(url, this.getCustomHeaders());
  }

  async deleteNote(noteUuid: string) {
    try {
      const endpoint = `${this.baseUrl}/${configuration.serviceUrls.noteService}note/${noteUuid}`;

      await this.restClientService.delete(endpoint, this.getCustomHeaders());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
