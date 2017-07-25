const chromeExtId = chrome.runtime.id;

let addToPortalClicked = false;

const go1buttonContainer = document.createElement('div');
const go1Button = document.createElement('button');
go1Button.innerHTML = "+";
go1Button.classList.add('go1-add-to-portal-button');
go1buttonContainer.appendChild(go1Button);
document.body.appendChild(go1buttonContainer);


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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command == "POPUP_INITIALIZED") {
    onPopupInitialized();
  }
  //   sendResponse({data: window.getSelection().toString()});
  // else
  //   sendResponse({}); // snub them.
});
