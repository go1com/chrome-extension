const cheerio = require('cheerio-without-node-native');

export class LinkPreview {
  getPreview(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.text())
        .then(text => {
          resolve(this._parseResponse(text, url));
        })
        .catch(error => reject({error}));
    });
  }

  _parseResponse(body, url) {
    const doc = cheerio.load(body);

    return {
      url,
      title: this._getTitle(doc),
      description: this._getDescription(doc),
      mediaType: this._getMediaType(doc) || 'website',
      images: this._getImages(doc, url),
    };
  }

  _getTitle(doc) {
    let title = doc('title').text();

    if (!title) {
      title = doc('meta[property=\'og:title\']').attr('content');
    }

    return title;
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
