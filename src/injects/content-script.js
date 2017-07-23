(async function (root) {
  if (!root.jQuery) {
    await Helpers.injectScript('https://code.jquery.com/jquery-3.2.1.min.js');
    console.log(root.jQuery);
  }
})(window);

const chromeExtId = chrome.runtime.id;
console.log(chrome);


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
