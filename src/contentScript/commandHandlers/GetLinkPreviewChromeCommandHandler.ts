import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import configuration from "../../environments/configuration";
import {inject, injectable} from "inversify";
import {LinkPreview} from "../../modules/linkPreviewer/linkPreviewService";

declare const $: any;

@injectable()
export class GetLinkPreviewChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.getLinkPreview;

  constructor(@inject(LinkPreview) private linkPreviewService: LinkPreview) {

  }

  DOMtoString(document_root) {
    let html = '', node = document_root.firstChild;
    while (node) {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          html += node.outerHTML;
          break;
        case Node.TEXT_NODE:
          html += node.nodeValue;
          break;
        case Node.CDATA_SECTION_NODE:
          html += '<![CDATA[' + node.nodeValue + ']]>';
          break;
        case Node.COMMENT_NODE:
          html += '<!--' + node.nodeValue + '-->';
          break;
        case Node.DOCUMENT_TYPE_NODE:
          // (X)HTML documents are identified by public identifiers
          html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
          break;
      }
      node = node.nextSibling;
    }
    return html;
  }

  handle(request: any, sender: any, sendResponse?: Function) {
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
