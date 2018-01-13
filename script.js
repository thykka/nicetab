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
  var favlist = FavList().init();
  var linklist = LinkList().init();
  var clock = Clock();
  var ip = IP();
});

function FavList() {
  var f = {
    el: {
      root: document.querySelector('.list--favorite')
    }
  };

  f.init = function (callback) {
    readFavs();
    f.removeFavs();
    f.showFavs();
    f.showInput();
  };

  f.removeFavs = function() {
    Array.from(document.querySelectorAll('.item--favorite'))
      .forEach(function(item, index) {
        item.remove();
      });
  };

  f.removeFav = function(url, title) {
    f.favs = f.favs.filter(function(fav, index) {
      return fav.url !== url && fav.title !== title;
    });
    writeFavs();
    f.removeFavs();
    f.showFavs();
    f.showInput();
  }

  f.showFavs = function() {
    f.favs.forEach(function(fav, index, favs) {
      var link = document.createElement('a');
      link.classList.add('link--favorite');
      link.setAttribute('href', fav.url);
      link.innerText = fav.title;
      var item = document.createElement('li');
      item.classList.add('item--favorite');
      item.appendChild(link);
      f.el.root.appendChild(item);
      var remover = document.createElement('button');
      remover.classList.add('remove--favorite');
      remover.innerText = '×';
      remover.addEventListener('click', handleRemoverClick);
      item.appendChild(remover);
    });
    if(f.el.favInItem) {
      f.el.root.appendChild(f.el.favInItem);
    }
  };

  f.showInput = function() {
    if(!f.el.favInItem) {
      f.el.favInItem = document.createElement('li');
      f.el.favInItem.classList.add('item--favorite');
    }
    if(!f.el.favInput) {
      f.el.favInput = document.createElement('input');
      f.el.favInput.id = 'favorite';
      f.el.favInput.setAttribute('type', 'text');
      f.el.favInput.classList.add('favorite-input');
      f.el.favInput.addEventListener('focusin', handleInputFocusin);
      f.el.favInput.addEventListener('keydown', handleInputKeydown);
    }
    if(!f.el.favLabel) {
      f.el.favLabel = document.createElement('label');
      f.el.favLabel.setAttribute('for', 'favorite');
      f.el.favLabel.classList.add('favorite-label');
    }
    f.el.root.appendChild(f.el.favInItem);
    f.el.favInItem.appendChild(f.el.favInput);
    f.el.favInItem.appendChild(f.el.favLabel);
    f.el.favLabel.dataset.text = 'URL';
  };

  function handleRemoverClick(evt) {
    var link = evt.target.parentNode.querySelector('.link--favorite');
    var title = link.innerText;
    var url = link.href;
    f.removeFav(url, title);
  }

  function handleInputFocusin(evt) {
    if(evt.target.value == '') {
      if(!f.tempURL) {
        evt.target.value = 'https://';
      } else if(!!f.tempURL && !f.tempTitle) {
        evt.target.value = 'My Bookmark';
      }
      evt.target.setSelectionRange(0, evt.target.value.length);
    }
  }
  function handleInputKeydown(evt) {
    if(!!evt.target.value && evt.keyCode == 13) {
      evt.preventDefault();
      if(!f.tempURL) {
        f.tempURL = evt.target.value;
        evt.target.value = '';
        f.el.favLabel.dataset.text = 'Title';
      } else if(!!f.tempURL && !f.tempTitle) {
        f.tempTitle = evt.target.value;
        evt.target.value = '';
        f.el.favLabel.dataset.text = '';
        f.newFav(Bookmark(f.tempURL, f.tempTitle));
        f.tempTitle = false;
        f.tempURL = false;
      }
    }
  }

  function Bookmark (url, title) {
    return {
      url: url,
      title: title !== '' ? title : url
    };
  }

  f.newFav = function(bookmark) {
    f.favs.push(bookmark);
    writeFavs();
    f.removeFavs();
    f.showFavs();
    f.showInput();
  };

  function readFavs () {
    f.favs = JSON.parse(localStorage.getItem('favs'));
    if(!f.favs) {
      f.favs = [
        // some defaults
        { url: 'http://localhost:8888',
          title: 'MAMP' },
        { url: 'http://localhost:3000',
          title: 'BrowserSync' },
        { url: 'https://devdocs.io',
          title: 'DevDocs' },
        { url: 'https://gmail.com',
          title: 'Gmail' },
        { url: 'https://reddit.com',
          title: 'Reddit' },
        { url: 'https://web.telegram.org',
          title: 'Telegram' },
        { url: 'https://developer.mozilla.org/en-US/docs/Web/',
          title: 'MDN' },
        { url: 'https://codepen.io/pen/',
          title: 'Codepen' },
        { url: 'https://snag.gy/',
          title: 'Snag.gy' },
      ];
      writeFavs();
    }
  }

  function writeFavs() {
    if(f.favs) {
      localStorage.setItem('favs', JSON.stringify(f.favs));
    } else {
      console.warn('nothing to write…');
    }
  }

  return f;
}

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
        count: 13,
        element: document.querySelector('.list--bookmark'),
        filter: function(e, i, a) {
          return e.url.indexOf('%s') == -1 && e.url.indexOf('javascript:') == -1;
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
