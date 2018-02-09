var themes = {
  'day': {
    images: {
      headerURL: '',
    },
    colors: {
      accentcolor: "#fffbf0",
      textcolor: "#533e17",
      toolbar: "#f6ead8",
      toolbar_text: "#7d6041"
    }
  },
  'night': {
    images: {
      headerURL: '',
    },
    colors: {
      accentcolor: "#1f2029",
      textcolor: "#e7e6ff",
      toolbar: "#363858",
      toolbar_text: "#ead9c2"
    }
  },
  'incognito': {
    images: {
      headerURL: '',
    },
    colors: {
      accentcolor: "#2a2e4e",
      textcolor: "#d7dbff",
      toolbar: "#a04c84",
      toolbar_text: "#ffbff1"
    }
  },
};

function setTheme(win, theme) {
  browser.theme.update(win.id, themes[theme]);
}

function checkTime(win) {
  var date = new Date();
  var hours = date.getHours();

  if ((hours >= 9) && (hours <= 17)) {
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
