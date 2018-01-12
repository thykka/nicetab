function Clock() {
  var c = {
    el: {
      hour:   document.querySelector('.time__hours'),
      minute: document.querySelector('.time__minutes'),
      second: document.querySelector('.time__seconds'),
      day:    document.querySelector('.time__day'),
      month:  document.querySelector('.time__month'),
      year:   document.querySelector('.time__year')
    }
  };
  c.update = function(t) {
    var now = new Date();
    c.el.hour.innerText = now.getHours();
    c.el.minute.innerText = ("0" + now.getMinutes()).substr(-2);
    c.el.second.innerText = ("0" + now.getSeconds()).substr(-2);

    c.el.day.innerText = ("0" + now.getDate()).substr(-2);
    c.el.month.innerText = ("0" + now.getMonth() + 1).substr(-2);
    c.el.year.innerText = now.getFullYear();
  }
  c.interval = setInterval(c.update, 1000);
  c.update();
  return c;
}

document.addEventListener('DOMContentLoaded', function() {
  moveTabAsLast();
  var linklist = LinkList().init();
  var clock = Clock();
  var ip = IP();
});

function IP() {
  var ip = {
    element: document.querySelector('.ipaddress--ext')
  };
  ip.getExternal = function() {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://icanhazip.com', true);
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        ip.element.innerText = this.response;
      }
    };
    request.onerror = function() {
      console.log(arguments);
    };
    request.send();
  }
  return ip.getExternal();
}


function LinkList() {
  var l = {
    lists: [
      {
        prefix: 'bookmark',
        count: 15,
        element: document.querySelector('.list--bookmark'),
        filter: function(e, i, a) {
          return e.url.indexOf('%s') == -1;
        }
      },{
        prefix: 'toplist',
        count: 13,
        element: document.querySelector('.list--toplist'),
        filter: function(e, i, a) {
          return !(e.url.indexOf('/search') >= 0 && e.url.indexOf('q=') >= 0);
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
    if(index === 0) {
      promise = browser.bookmarks.getRecent(lists[index].count)
    } else if (index === 1) {
      promise = browser.topSites.get()
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

  return l;
}

// Always places new tabs last in the tab bar
function moveTabAsLast() {
  browser.tabs.getCurrent().then(function(e) {
    var thisTabID = e.id;
    browser.tabs.move(thisTabID, {
      index: -1
    });
  });
}
