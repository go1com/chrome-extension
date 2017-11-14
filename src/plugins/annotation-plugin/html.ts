import {
  FragmentAnchor,
  RangeAnchor,
  TextPositionAnchor,
  TextQuoteAnchor
} from "./types";

const querySelector = function (type, root, selector, options) {
  return new Promise((resolve, reject) => {
    try {
      const anchor = type.fromSelector(root, selector, options);
      const range = anchor.toRange(options);
      return resolve(range);
    } catch (error) {
      return reject(error);
    }
  });
};


/**
 * Anchor a set of selectors.
 *
 * This function converts a set of selectors into a document range.
 * It encapsulates the core anchoring algorithm, using the selectors alone or
 * in combination to establish the best anchor within the document.
 *
 * :param Element root: The root element of the anchoring context.
 * :param Array selectors: The selectors to try.
 * :param Object options: Options to pass to the anchor implementations.
 * :return: A Promise that resolves to a Range on success.
 * :rtype: Promise
 *///
export function anchor(root, selectors, options) {
  // Selectors
  if (options === null) {
    options = {};
  }
  let fragment = null;
  let position = null;
  let quote = null;
  let range = null;

  // Collect all the selectors
  for (const selector of selectors) {
    switch (selector.type) {
      case 'FragmentSelector':
        fragment = selector;
        break;
      case 'TextPositionSelector':
        position = selector;
        options.hint = position.start;  // TextQuoteAnchor hint
        break;
      case 'TextQuoteSelector':
        quote = selector;
        break;
      case 'RangeSelector':
        range = selector;
        break;
    }
  }

  // Assert the quote matches the stored quote, if applicable
  const maybeAssertQuote = function (_range) {
    if (((quote !== null ? quote.exact : undefined) !== null) && (_range.toString() !== quote.exact)) {
      throw new Error('quote mismatch');
    } else {
      return _range;
    }
  };

  // From a default of failure, we build up catch clauses to try selectors in
  // order, from simple to complex.
  let promise = Promise.reject('unable to anchor');

  if (fragment !== null) {
    promise = promise.catch(() =>
      querySelector(FragmentAnchor, root, fragment, options)
        .then(maybeAssertQuote)
    );
  }

  if (range !== null) {
    promise = promise.catch(() =>
      querySelector(RangeAnchor, root, range, options)
        .then(maybeAssertQuote)
    );
  }

  if (position !== null) {
    promise = promise.catch(() =>
      querySelector(TextPositionAnchor, root, position, options)
        .then(maybeAssertQuote)
    );
  }

  if (quote !== null) {
    promise = promise.catch(() =>
      // Note: similarity of the quote is implied.
      querySelector(TextQuoteAnchor, root, quote, options)
    );
  }

  return promise;
}


export function describe(root, range, options) {
  if (options === null) {
    options = {};
  }

  const types = [FragmentAnchor, RangeAnchor, TextPositionAnchor, TextQuoteAnchor];

  const result = [];
  for (const type of Array.from(types)) {
    try {
      let selector;
      const anchor: any = type.fromRange(root, range);
      selector = anchor.toSelector(options);

      console.log(selector);
      result.push(selector);
    } catch (error) {

    }
  }
  return result;
}

const htmlUtil = {
  describe: describe,
  anchor: anchor
};

export default htmlUtil;
