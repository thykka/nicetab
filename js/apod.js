function APOD() {
  var q = {
    endpoint: 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY',
    selector: '#apod',
  };

  q.init = function() {
    q.imageElement = document.querySelector(q.selector);
    q.imageElement.classList.add('loading');
    getCurrentAPOD();
    return q;
  }

  q.setCache = function(url, date) {
    browser.storage.local.set({apod: {
      image: url,
      date: date
    }});
  };

  q.getCached = function(date) {
    browser.storage.local.get('apod').then(function(res) {
      if(!!res['apod']) {
        if(!!res.apod['date']) {
          if(res.apod.date == formatDate(new Date())) {
            q.updateView(res.apod);
            return;
          }
        }
      }
      fetchAPOD();
      return;
    });
  };

  q.updateView = function(apod) {
    q.imageElement.setAttribute('src', apod.image);
    q.imageElement.addEventListener('load', q.handleLoaded);
  };

  q.handleLoaded = function() {
    q.imageElement.classList.remove('loading');
  };

  function getCurrentAPOD () {
    var now = formatDate(new Date());
    q.getCached(now);
  }

  function formatDate(date) {
    return [
      date.getFullYear(),
      ("0" + (date.getMonth() + 1)).substr(-2, 2),
      ("0" + date.getDate()).substr(-2, 2)
    ].join('-');
  }

  function fetchAPOD() {
    var request = new XMLHttpRequest();
    request.open('GET', q.endpoint, true);
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        var data = JSON.parse(this.response);
        var url = data.url;
        var date = data.date;
        q.setCache(url, date);
      }
    };
    request.onerror = function() {
      console.error(arguments);
    };
    request.send();
  }

  return q.init();
}

var apod = APOD();
