import configuration from "../../../environments/configuration";
import {inject, injectable} from "inversify";
import {IRestClientService, IRestClientServiceSymbol} from "../../../services/restClientService/IRestClientService";
import {IStorageService, IStorageServiceSymbol} from "../../../services/storageService/IStorageService";

@injectable()
export class DiscussionNoFirebaseServiceService {
  protected baseUrl = configuration.environment.baseApiUrl;

  constructor(@inject(IRestClientServiceSymbol) protected restClientService: IRestClientService,
              @inject(IStorageServiceSymbol) protected storageService: IStorageService) {
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
