import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {LinkPreview} from "../../modules/linkPreviewer/linkPreviewService";

export class GetLinkPreviewChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.getLinkPreview;

  private linkPreviewer: LinkPreview;

  constructor() {
    this.linkPreviewer = new LinkPreview();
  }

  handle(request: any, sender: any, sendResponse: Function) {
    this.linkPreviewer.getPreview(request.data)
      .then((response: any) => {
        const anchor = document.createElement('a');
        anchor.href = request.data;

        if (!response.favicon) {
          response.favicon = `${anchor.protocol}//${anchor.hostname}${anchor.port && anchor.port !== '80' ? `:${anchor.port}` : ''}/favicon.ico`;
        }

        if (!response.favicon.startsWith(anchor.protocol)) {
          response.favicon = `${anchor.protocol}//${anchor.hostname}${anchor.port && anchor.port !== '80' ? `:${anchor.port}` : ''}${response.favicon}`;
        }

        response.hostname = anchor.hostname;

        if (response.images && response.images.length) {
          response.image = response.images[0];
        }

        sendResponse({
          success: true,
          data: response
        });
        return;
      });
  }
}
