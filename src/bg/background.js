// chrome.browserAction.onClicked.addListener(function(tab) {
//     console.log('clicked')
//     chrome.runtime.sendMessage({getLogs: true}, function(response) {
//       console.log(response);
//     });
// });

chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  //console.log('Turning ' + tab.url + ' red!');
  chrome.tabs.executeScript(tab.id, {
    file: 'inject.js'
  });
});