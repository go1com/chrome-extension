import {ICommandHandler} from "../../services/commandHandlerService/ICommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import configuration from "../../environments/configuration";
import {inject, injectable} from "inversify";
import {LinkPreview} from "../../modules/linkPreviewer/linkPreviewService";

declare const $: any;

@injectable()
export class GetLinkPreviewCommandHandler implements ICommandHandler {
  command = commandKeys.getLinkPreview;

  constructor(@inject(LinkPreview) private linkPreviewService: LinkPreview) {

  }

  async handle(request: any, sender: any, sendResponse?: Function) {
    const pageMetadataInfo: any = {
      url: document.location.href,
      title: this.linkPreviewService.getTitle(document),
      description: this.linkPreviewService.getDescription(document),
      images: this.linkPreviewService.getImages(document, document.location.href),
    };

    chrome.runtime.sendMessage({
      from: 'content',
      action: 'getTabId'
    }, response => {
      configuration.currentChromeTab = response;
      pageMetadataInfo.favicon = response.tab.favIconUrl;
      pageMetadataInfo.hostname = document.location.hostname;

      if (sendResponse) {
        sendResponse({
          success: true,
          data: pageMetadataInfo
        });
      }
    });
  }
}
