const scriptInjection = [];

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

injectScript('injects/go1button.js');

const go1buttonContainer = document.createElement('div');
const go1Button = document.createElement('button');
go1Button.innerHTML = "+";
go1Button.classList.add('go1-add-to-portal-button');
go1buttonContainer.appendChild(go1Button);

go1Button.addEventListener('click', function onGo1ButtonClicked() {
  chrome.runtime.sendMessage({command: "ADD_TO_PORTAL"}, function (response) {
    console.log(response.farewell);
  });
});

document.body.appendChild(go1buttonContainer);
//
// chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.method == "getSelection")
//     sendResponse({data: window.getSelection().toString()});
//   else
//     sendResponse({}); // snub them.
// });
