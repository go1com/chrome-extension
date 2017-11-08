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

  protected async getCustomHeaders() {
    return {
      'Authorization': `Bearer ${ await this.storageService.retrieve(configuration.constants.localStorageKeys.authentication) }`
    };
  }

  async getUserNotesFromService(contextUrl?: string) {
    let url = `${this.baseUrl}/${configuration.serviceUrls.noteService}notes`;

    const queries = [];

    queries.push(`type=${configuration.constants.noteChromeExtType}`);

    if (!contextUrl && configuration.currentChromeTab && configuration.currentChromeTab.url) {
      contextUrl = configuration.currentChromeTab.url
    }

    if (contextUrl) {
      queries.push(`context[url]=${contextUrl}`);
    }

    if (queries.length) {
      url += `?${queries.join('&')}`;
    }

    const response = await this.restClientService.get(url, await this.getCustomHeaders());
    const publicNoteResponse = await this.getPublicNotesFromService(contextUrl);
    // console.log(publicNoteResponse.concat(response));

    return publicNoteResponse.concat(response);
  }

  async getPublicNotesFromService(contextUrl: string) {
    let url = `${this.baseUrl}/${configuration.serviceUrls.noteService}notes`;

    const queries = [];

    const currentPortalId = await this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId);

    queries.push(`instance=${currentPortalId}`);
    queries.push(`public=1`);

    if (!contextUrl && configuration.currentChromeTab && configuration.currentChromeTab.url) {
      contextUrl = configuration.currentChromeTab.url
    }

    if (contextUrl) {
      queries.push(`context[url]=${contextUrl}`);
    }

    if (queries.length) {
      url += `?${queries.join('&')}`;
    }

    const response = await this.restClientService.get(url, await this.getCustomHeaders());

    return response;
  }

  async deleteNote(noteUuid: string) {
    try {
      const endpoint = `${this.baseUrl}/${configuration.serviceUrls.noteService}note/${noteUuid}`;

      await this.restClientService.delete(endpoint, await this.getCustomHeaders());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
