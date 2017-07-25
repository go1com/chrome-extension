const newDiscussionTemplate = require('./views/newDiscussionComponent.tpl.jade');

const chromeExtId = chrome.runtime.id;
const go1ExtensionContainer = document.createElement('div');
go1ExtensionContainer.classList.add('go1-extension');
go1ExtensionContainer.classList.add('go1-extension-injected');

const go1Button = document.createElement('button');
go1Button.innerHTML = "+";
go1Button.classList.add('go1-add-to-portal-button');
go1ExtensionContainer.appendChild(go1Button);
document.body.appendChild(go1ExtensionContainer);

go1Button.addEventListener('click', function onGo1ButtonClicked() {
  console.log(newDiscussionTemplate);
  go1ExtensionContainer.insertAdjacentHTML('beforeend', newDiscussionTemplate);
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

});
