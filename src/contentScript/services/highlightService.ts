import Util from "../../libs/annotation-plugin/util";
import { injectable } from "inversify";

declare const $: any;
export const highlightClassName = 'go1-annotation-highlight';
const elementName = 'go1-highlight-annotation';

@injectable()
export class HighlightService {
  async highlight(text, domXpath, highlightId, specialClass?: string) {
    const quotationNode = Util.nodeFromXPath(domXpath);

    let effectiveClass = highlightClassName;
    if (specialClass) {
      effectiveClass += ' ' + specialClass;
    }

    return new Promise((resolve, reject) => {
      try {
        $(quotationNode).highlight(text, {
          className: effectiveClass,
          element: elementName
        }, (dom) => {
          $(dom).attr('id', `${elementName}-${highlightId}`);
          resolve(dom);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  unhighlight() {
    $("*", elementName).unwrap();
  }
}
