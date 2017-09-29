let COMPLETE = 'complete',
  CANCELED = 'canceled';

function raf(task) {
  if ('requestAnimationFrame' in window) {
    return window.requestAnimationFrame(task);
  }

  setTimeout(task, 16);
}

function setElementScroll(element, x, y) {
  if (element.self === element) {
    element.scrollTo(x, y);
  } else {
    element.scrollLeft = x;
    element.scrollTop = y;
  }
}

function getTargetScrollLocation(target, parent, align) {
  let targetPosition = target.getBoundingClientRect(),
    parentPosition,
    x,
    y,
    differenceX,
    differenceY,
    targetWidth,
    targetHeight,
    leftAlign = align && align.left != null ? align.left : 0.5,
    topAlign = align && align.top != null ? align.top : 0.5,
    leftOffset = align && align.leftOffset != null ? align.leftOffset : 0,
    topOffset = align && align.topOffset != null ? align.topOffset : 0,
    leftScalar = leftAlign,
    topScalar = topAlign;

  if (parent.self === parent) {
    targetWidth = Math.min(targetPosition.width, parent.innerWidth);
    targetHeight = Math.min(targetPosition.height, parent.innerHeight);
    x = targetPosition.left + parent.pageXOffset - parent.innerWidth * leftScalar + targetWidth * leftScalar;
    y = targetPosition.top + parent.pageYOffset - parent.innerHeight * topScalar + targetHeight * topScalar;
    x -= leftOffset;
    y -= topOffset;
    differenceX = x - parent.pageXOffset;
    differenceY = y - parent.pageYOffset;
  } else {
    targetWidth = targetPosition.width;
    targetHeight = targetPosition.height;
    parentPosition = parent.getBoundingClientRect();
    let offsetLeft = targetPosition.left - (parentPosition.left - parent.scrollLeft);
    let offsetTop = targetPosition.top - (parentPosition.top - parent.scrollTop);
    x = offsetLeft + (targetWidth * leftScalar) - parent.clientWidth * leftScalar;
    y = offsetTop + (targetHeight * topScalar) - parent.clientHeight * topScalar;
    x = Math.max(Math.min(x, parent.scrollWidth - parent.clientWidth), 0);
    y = Math.max(Math.min(y, parent.scrollHeight - parent.clientHeight), 0);
    x -= leftOffset;
    y -= topOffset;
    differenceX = x - parent.scrollLeft;
    differenceY = y - parent.scrollTop;
  }

  return {
    x: x,
    y: y,
    differenceX: differenceX,
    differenceY: differenceY
  };
}

function animate(parent) {
  raf(function () {
    let scrollSettings = parent._scrollSettings;
    if (!scrollSettings) {
      return;
    }

    let location = getTargetScrollLocation(scrollSettings.target, parent, scrollSettings.align),
      time = Date.now() - scrollSettings.startTime,
      timeValue = Math.min(1 / scrollSettings.time * time, 1);

    if (
      time > scrollSettings.time + 20
    ) {
      setElementScroll(parent, location.x, location.y);
      parent._scrollSettings = null;
      return scrollSettings.end(COMPLETE);
    }

    let easeValue = 1 - scrollSettings.ease(timeValue);

    setElementScroll(parent,
      location.x - location.differenceX * easeValue,
      location.y - location.differenceY * easeValue
    );

    animate(parent);
  });
}

function transitionScrollTo(target, parent, settings, callback) {
  let idle = !parent._scrollSettings,
    lastSettings = parent._scrollSettings,
    now = Date.now(),
    endHandler;

  if (lastSettings) {
    lastSettings.end(CANCELED);
  }

  function end(endType) {
    parent._scrollSettings = null;
    if (parent.parentElement && parent.parentElement._scrollSettings) {
      parent.parentElement._scrollSettings.end(endType);
    }
    callback(endType);
    parent.removeEventListener('touchstart', endHandler);
  }

  parent._scrollSettings = {
    startTime: lastSettings ? lastSettings.startTime : Date.now(),
    target: target,
    time: settings.time + (lastSettings ? now - lastSettings.startTime : 0),
    ease: settings.ease,
    align: settings.align,
    end: end
  };

  endHandler = end.bind(null, CANCELED);
  parent.addEventListener('touchstart', endHandler);

  if (idle) {
    animate(parent);
  }
}

function defaultIsScrollable(element) {
  return (
    'pageXOffset' in element ||
    (
      element.scrollHeight !== element.clientHeight ||
      element.scrollWidth !== element.clientWidth
    ) &&
    getComputedStyle(element).overflow !== 'hidden'
  );
}

function defaultValidTarget() {
  return true;
}

export default function scrollIntoView(target?: any, settings?: any, callback?: Function) {
  if (!target) {
    return;
  }

  if (typeof settings === 'function') {
    callback = settings;
    settings = null;
  }

  if (!settings) {
    settings = {};
  }

  settings.time = isNaN(settings.time) ? 1000 : settings.time;
  settings.ease = settings.ease || function (v) {
    return 1 - Math.pow(1 - v, v / 2);
  };

  let parent = target.parentElement,
    parents = 0;

  function done(endType) {
    parents--;
    if (!parents) {
      callback && callback(endType);
    }
  }

  let validTarget = settings.validTarget || defaultValidTarget;
  let isScrollable = settings.isScrollable;

  while (parent) {
    if (validTarget(parent, parents) && (isScrollable ? isScrollable(parent, defaultIsScrollable) : defaultIsScrollable(parent))) {
      parents++;
      transitionScrollTo(target, parent, settings, done);
    }

    parent = parent.parentElement;

    if (!parent) {
      return;
    }

    if (parent.tagName === 'BODY') {
      parent = parent.ownerDocument;
      parent = parent.defaultView || parent.ownerWindow;
    }
  }
};
