import Util from "../../libs/annotation-plugin/util";
import {injectable} from "inversify";

declare const $: any;
const highlightClassName = 'go1-annotation-highlight';
const elementName = 'go1-highlight-annotation';

@injectable()
export class HighlightService {
  async highlight(text, domXpath, specialClass?: string) {
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
          resolve(dom);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  unhighlight() {
    $(elementName).unhighlight({
      className: highlightClassName
    });
  }
}
