const Helpers = {
  scriptInjection: [],

  inject(fn) {
    const script = document.createElement('script');
    fn(script);
    document.documentElement.appendChild(script);
    script.parentNode.removeChild(script);
  },
  async injectScript(path) {
    if (this.scriptInjection.indexOf(path) > -1) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.inject(script => {
        script.src = path.startsWith('http') ? path : chrome.extension.getURL(path);
        script.addEventListener('load', function () {
          resolve();
        });
      });
      this.scriptInjection.push(path);

    });
  }
};
