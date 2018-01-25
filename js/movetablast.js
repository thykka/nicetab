// Always places new tabs last in the tab bar
moveTabLast();
function moveTabLast() {
  browser.tabs.getCurrent().then(function(e) {
    var thisTabID = e.id;
    browser.tabs.move(thisTabID, {
      index: -1
    });
  });
}
