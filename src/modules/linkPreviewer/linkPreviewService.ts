import {commandKeys} from "../../commandHandlers/commandKeys";

const cheerio = require('cheerio-without-node-native');

export class LinkPreview {
  getPreview(url) {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          name: commandKeys.getLinkPreview
        }, (response) => {
          console.log(response);
          resolve(this._parseResponse(response.data, url));
        });
      });
    });
  }

  _parseResponse(body, url) {
    const doc = cheerio.load(body);

    return {
      url,
      title: this._getTitle(doc),
      description: this._getDescription(doc) || '',
      mediaType: this._getMediaType(doc) || 'website',
      images: this._getImages(doc, url),
      favicon: this._getFavicon(doc)
    };
  }

  _getTitle(doc) {
    let title = doc('title').text();

    if (!title) {
      title = doc('meta[property=\'og:title\']').attr('content');
    }

    return title;
  }

  _getFavicon(doc) {
    return doc('link[rel=\'apple-touch-icon-precomposed\']').attr('href') ||
      doc('link[rel=\'shortcut icon\']').attr('href') ||
      doc('link[rel=\'icon\']').attr('href') ||
      "";
  }

  _getDescription(doc) {
    let description = doc('meta[name=description]').attr('content');

    if (description === undefined) {
      description = doc('meta[name=Description]').attr('content');
    }

    if (description === undefined) {
      description = doc('meta[property=\'og:description\']').attr('content');
    }

    return description;
  }

  _getMediaType(doc) {
    const node = doc('meta[name=medium]');

    if (node.length) {
      const content = node.attr('content');
      return content === 'image' ? 'photo' : content;
    } else {
      return doc('meta[property=\'og:type\']').attr('content');
    }
  }

  _getImages(doc, rootUrl) {
    const images = [];
    const nodes = doc('meta[property=\'og:image\']');

    if (nodes.length > 0) {
      nodes.each((index, node) => {
        images.push(node.attribs.content);
      });
    }

    return images;
  }
}
