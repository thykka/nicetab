FavList();

function FavList() {
  var f = {
    el: {
      root: document.querySelector('.list--favorite')
    }
  };

  f.init = function (callback) {
    readFavs();
  };

  f.draw = function() {
    f.removeFavs();
    f.showFavs();
    f.showInput();
  }

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
    f.draw();
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
      f.el.favInput.addEventListener('focusout', handleInputFocusout);
      f.el.favInput.addEventListener('keydown', handleInputKeydown);
    }
    if(!f.el.favLabel) {
      f.el.favLabel = document.createElement('label');
      f.el.favLabel.setAttribute('for', 'favorite');
      f.el.favLabel.style.pointerEvents = 'none';
      f.el.favLabel.classList.add('favorite-label');
    }
    f.el.root.appendChild(f.el.favInItem);
    f.el.favInItem.appendChild(f.el.favInput);
    f.el.favInItem.appendChild(f.el.favLabel);
  };

  function handleRemoverClick(evt) {
    var link = evt.target.parentNode.querySelector('.link--favorite');
    var title = link.innerText;
    var url = link.href;
    f.removeFav(url, title);
  }

  function handleInputFocusout(evt) {
    if(evt.target.value === 'https://') {
      //evt.target.value = '';
    }
  }

  function handleInputFocusin(evt) {
    var input = evt.target;
    if(input.value === '') {
      if(!f.tempURL) {
        input.value = 'https://';
        switchToURLInput(input);
      } else if(!!f.tempURL && !f.tempTitle) {
        switchToTitleInput(input);
      }
      selectEntireInput(input);
    }
  }
  function switchToTitleInput(input) {
    f.el.favInput.setAttribute('type', 'text');
    f.el.favLabel.dataset.text = 'Title';
    input.value = 'My Bookmark';
  }
  function switchToURLInput(input) {
    f.el.favInput.setAttribute('type', 'url');
    f.el.favLabel.dataset.text = 'URL';
  }
  function switchToNoInput() {
    f.el.favInput.setAttribute('type', 'text');
    f.el.favInput.value = '';
    f.el.favInput.blur();
  }
  function selectEntireInput(input) {
    input.setSelectionRange(0, input.value.length);
  }
  function handleInputKeydown(evt) {
    var input = evt.target;
    if(evt.keyCode === 27) {
      // esc
      evt.preventDefault();
      switchToNoInput();
      resetTemp();
    }
    else if(!!input.value && evt.keyCode === 13) {
      // enter
      evt.preventDefault();
      if(!f.tempURL) {
        saveTempURL(input.value);
        switchToTitleInput(input);
        selectEntireInput(input);
      } else if(!!f.tempURL && !f.tempTitle) {
        saveTempTitle(input.value);
        f.newFav(
          Bookmark(f.tempURL, f.tempTitle)
        );
        switchToNoInput();
        resetTemp();
      }
    }
  }

  function saveTempURL(url) {
    if(!f.tempURL) {
      f.tempURL = url;
    } else {
      console.warn('tempURL already exists: ', f.tempURL);
    }
  }
  function saveTempTitle(title) {
    if(!f.tempName) {
      f.tempTitle = title;
    } else {
      console.warn('tempName already exists: ', f.tempName);
    }
  }
  function resetTemp() {
    f.tempTitle = false;
    f.tempURL = false;
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
    f.draw();
  };

  function readFavs() {
    browser.storage.local.get('favlist')
      .then(function(res) {
        if(res.favlist) {
          f.favs = res.favlist;
        } else {
          f.favs = [
            // some defaults
            { url: 'http://localhost:8888',
              title: 'MAMP' },
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
        }
        f.draw();
      });
  }

  function writeFavs() {
    if(f.favs) {
      browser.storage.local.set({
        favlist: f.favs
      });
    } else {
      console.warn('nothing to write…');
    }
  }

  return f.init();
}
