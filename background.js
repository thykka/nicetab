var themes = {
  'day': {
    images: {
      headerURL: '',
    },
    colors: {
      accentcolor: '#FFFFFF',
      textcolor: '#000000',
      toolbar: '#EEEEEE',
      toolbar_text: '#666666',
    }
  },
  'night': {
    images: {
      headerURL: '',
    },
    colors: {
      accentcolor: '#333333',
      textcolor: '#CCCCCC',
      toolbar: '#111111',
      toolbar_text: '#AAAAAA',
    }
  },
  'incognito': {
    images: {
      headerURL: '',
    },
    colors: {
      accentcolor: '#331155',
      textcolor: '#EEFFFF',
      toolbar: '#442266',
      toolbar_text: '#FFEEEE',
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

async function fetchThemeFromStorage() {
  var themes = await browser.storage.local.get('themes');
  console.log(themes);
  return themes;
}

function checkLS() {
  var themes = fetchThemeFromStorage();
  if(typeof themes === "undefined" || themes === null || !themes.hasOwnProperty('day')) {
    saveTheme();
  }
}
function saveTheme() {
  browser.storage.local.set({themes});
}

// Set up an alarm to check this regularly.
browser.alarms.onAlarm.addListener(checkAllWindows);
browser.alarms.create('checkAllWindows', {periodInMinutes: 5});


checkLS();
browser.windows.onCreated.addListener(checkAllWindows);
checkAllWindows();

function handleMessage(mess) {
  if (mess.themes) {
    themes = mess.themes;
    checkAllWindows();
  }
}
browser.runtime.onMessage.addListener(handleMessage);
