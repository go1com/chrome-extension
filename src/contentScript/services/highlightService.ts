import Util from "../../libs/annotation-plugin/util";

declare const $: any;
const highlightClassName = 'go1-annotation-highlight';
const elementName = 'go1-highlight-annotation';

export class HighlightService {
  static async highlight(text, domXpath, specialClass?: string) {
    const quotationNode = Util.nodeFromXPath(domXpath);

    let effectiveClass = highlightClassName;
    if (specialClass) {
      effectiveClass += ' ' + specialClass;
    }

    return new Promise((resolve, reject) => {
      $(quotationNode).highlight(text, {
        className: effectiveClass,
        element: elementName
      }, (dom) => {
        resolve(dom);
      });
    });
  }

  static unhighlight() {
    $('body').unhighlight({
      element: elementName,
      className: highlightClassName
    });
  }
}
