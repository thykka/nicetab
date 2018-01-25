LinkList();
function LinkList() {
  var l = {
    lists: [
      {
        prefix: 'bookmark',
        count: 13,
        element: document.querySelector('.list--bookmark'),
        filter: function(e, i, a) {
          return (
            e.url.indexOf('%s') == -1 &&
            e.url.indexOf('javascript:') == -1
          );
        }
      },{
        prefix: 'toplist',
        count: 19,
        element: document.querySelector('.list--toplist'),
        filter: function(e, i, a) {
          return (
            e.url.indexOf('/search') == -1 &&
            e.url.indexOf('q=') == -1 &&
            e.url.indexOf('moz-extension://') == -1
          );
        }
      }
    ]
  };

  l.init = function() {
    l.lists.forEach(initList);
  }

  // Populate & process bookmarks
  function initList(list, index, lists) {
    var promise;

    switch(list.prefix) {
    case 'bookmark':
      promise = browser.bookmarks.getRecent(lists[index].count)
      break;
    case 'toplist':
      promise = browser.topSites.get()
      break;
    default:
    }

    promise.then(function(linkObj) {
      linkObj.slice(0, list.count)
        .filter(list.filter)
        .forEach(function(link){
          createLink(link, list.prefix, list.element);
        });
    });
  }

  // Create HTML markup for a link object.
  function createLink(link, prefix, element) {
    if(!link.title || !link.url) { return; }
    var listElt = document.createElement('li');
    var linkElt = document.createElement('a');
    listElt.classList.add('item--' + prefix);
    linkElt.classList.add('link--' + prefix);
    linkElt.innerText = link.title;
    linkElt.setAttribute('href', link.url);
    listElt.appendChild(linkElt);
    element.appendChild(listElt);
  }

  return l.init();
}
