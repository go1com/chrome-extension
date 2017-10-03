import {IChromeCommandHandler} from "../../commandHandlers/IChromeCommandHandler";
import {commandKeys} from "../../commandHandlers/commandKeys";
import Util from "../../libs/annotation-plugin/util";

declare const $: any;

export class JumpToQuoteTextChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.jumpToQuotedText;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse?: Function) {
    if (request.data.quotation && request.data.quotationPosition) {
      const quotationNode = Util.nodeFromXPath(request.data.quotationPosition);

      /*$('.go1-annotation-highlight').parent().unmark({
        className: 'go1-annotation-highlight'
      });

      $(quotationNode).parent().mark(request.data.quotation, {
        className: 'go1-annotation-highlight',
        accuracy: 'exactly',
        separateWordSearch: false
      });*/

      // remove old highlights
      $('.go1-annotation-highlight').parent().unhighlight({
        className: 'go1-annotation-highlight'
      });

      console.log('Node to highlight', $(quotationNode));

      $(quotationNode).highlight(request.data.quotation, {
          className: 'go1-annotation-highlight'
        }, (dom) => {
          console.log(dom);
          const scrollTo = $(dom);

          $('html, body').animate({
            scrollTop: scrollTo.offset().top - 75
          });​
        }
      );
    }

    if (sendResponse) {
      sendResponse({success: true});
    }
  }
}
