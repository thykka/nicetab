var themes = {
  'day': {
    images: {
      headerURL: '',
    },
    colors: {
      accentcolor: '#DDD',
      textcolor: '#111',
      toolbar: '#EEE',
      toolbar_text: 'black',
    }
  },
  'night': {
    images: {
      headerURL: '',
    },
    colors: {
      accentcolor: '#000',
      textcolor: '#fff',
      toolbar: '#111',
      toolbar_text: '#EEE',
    }
  },
  'incognito': {
    images: {
      headerURL: '',
    },
    colors: {
      accentcolor: '#406',
      textcolor: '#fcf',
      toolbar: '#517',
      toolbar_text: '#EEE',
    }
  },
};

function setTheme(win, theme) {
  browser.theme.update(win.id, themes[theme]);
}

function checkTime(win) {
  var date = new Date();
  var hours = date.getHours();

  if ((hours > 9) && (hours < 18)) {
    setTheme(win, 'day');
  } else {
    setTheme(win, 'night');
  }
}

function checkIncognito(win) {
  if(win.incognito) {
    setTheme(win, 'incognito');
  } else {
    checkTime(win);
  }
}

function checkAllWindows() {
  browser.windows.getAll().then(function(wins) {
    wins.forEach(function(win) {
      checkIncognito(win);
    });
  });
}

// Set up an alarm to check this regularly.
browser.alarms.onAlarm.addListener(checkAllWindows);
browser.alarms.create('checkAllWindows', {periodInMinutes: 5});


browser.windows.onCreated.addListener(checkAllWindows);
checkAllWindows();
