const scriptInjection = [];

const chromeExtId = chrome.runtime.id;
console.log(chrome);


const inject = (fn) => {
  const script = document.createElement('script');
  fn(script);
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
};

const injectScript = (path) => {
  if (scriptInjection.indexOf(path) > -1) {
    return;
  }

  inject(script => {
    script.src = chrome.extension.getURL(path);
  });

  scriptInjection.push(path);
};

const go1buttonContainer = document.createElement('div');
const go1Button = document.createElement('button');
go1Button.innerHTML = "+";
go1Button.classList.add('go1-add-to-portal-button');
go1buttonContainer.appendChild(go1Button);

let addToPortalClicked = false;
go1Button.addEventListener('click', function onGo1ButtonClicked() {
  addToPortalClicked = true;
  chrome.runtime.sendMessage({
    from: 'content',
    action: 'showPopup'
  });
});

function onPopupInitialized() {
  if (addToPortalClicked) {
    chrome.runtime.sendMessage({command: "ADD_TO_PORTAL"}, function (response) {
      addToPortalClicked = false;
    });
  }
}

console.log(chromeExtId);

document.body.appendChild(go1buttonContainer);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  debugger;
  if (request.command == "POPUP_INITIALIZED") {
    onPopupInitialized();
  }
  //   sendResponse({data: window.getSelection().toString()});
  // else
  //   sendResponse({}); // snub them.
});
