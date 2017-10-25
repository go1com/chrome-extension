import {injectable} from "inversify";

declare const $: any;

@injectable()
export class LinkPreview {
  static Symbol = Symbol("LinkPreview");


  getTitle(doc) {
    let title = $(doc).find('title').text();

    if (!title) {
      title = $(doc).find('meta[property=\'og:title\']').attr('content');
    }

    return title;
  }

  getFavicon(doc) {
    return $(doc).find('link[rel=\'apple-touch-icon-precomposed\']').attr('href') ||
      $(doc).find('link[rel=\'shortcut icon\']').attr('href') ||
      $(doc).find('link[rel=\'icon\']').attr('href') ||
      "";
  }

  getDescription(doc) {
    let description = $(doc).find('meta[name=description]').attr('content');

    if (description === undefined) {
      description = $(doc).find('meta[name=Description]').attr('content');
    }

    if (description === undefined) {
      description = $(doc).find('meta[property=\'og:description\']').attr('content');
    }

    return description;
  }

  getMediaType(doc) {
    const node = $(doc).find('meta[name=medium]');

    if (node.length) {
      const content = node.attr('content');
      return content === 'image' ? 'photo' : content;
    } else {
      return $(doc).find('meta[property=\'og:type\']').attr('content');
    }
  }

  getImages(doc, rootUrl) {
    const images = [];
    const nodes = $(doc).find('meta[property=\'og:image\']');

    nodes.each(function () {
      images.push($(this).attr('content'));
    });

    return images;
  }
}
