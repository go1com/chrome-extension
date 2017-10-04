import Util from "../../libs/annotation-plugin/util";

declare const $: any;
const highlightClassName = 'go1-annotation-highlight';

export class HighlightService {
  static async highlight(text, domXpath, specialClass?: string) {
    const quotationNode = Util.nodeFromXPath(domXpath);

    // remove old highlights
    $(`.${highlightClassName}`).parent().unhighlight({
      className: highlightClassName
    });

    let effectiveClass = highlightClassName;
    if (specialClass) {
      effectiveClass += ' ' + specialClass;
    }

    return new Promise((resolve, reject) => {
      $(quotationNode).highlight(text, {
        className: effectiveClass
      }, (dom) => {
        resolve(dom);
      });
    });
  }
}
