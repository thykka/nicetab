var currentThemes;

updateTheme();

function updateTheme() {
  var themeName;
  if(browser.extension.inIncognitoContext) {
    themeName = 'incognito';
  } else {
    themeName = 'night';
    var date = new Date();
    var hours = date.getHours();
    if ((hours > 9) && (hours < 18)) {
      themeName = 'day';
    }
  }
  setTheme(themeName);
}
function setTheme(themeName) {
  fetchThemesFromStorage().then(function(storage){
    var theme = storage['themes'][themeName];
    currentThemes = storage['themes'];
    loadTheme(theme);
    updateSettingsUI(storage['themes']);
  });
}
async function fetchThemesFromStorage() {
  var themes = await browser.storage.local.get('themes');
  return themes;
}
function loadTheme(theme) {
  var css = [
    ':root {',
    '--bg: ', theme.colors.accentcolor, ';\n',
    '--fg: ', theme.colors.textcolor, ';\n',
    '--bg-alt: ', theme.colors.toolbar, ';\n',
    '--fg-alt: ', theme.colors.toolbar_text, ';\n',
    '}'
  ].join('');
  injectStyle(css);
}

var injectedStyles;
function injectStyle(css) {
  if(!injectedStyles) {
    injectedStyles = document.createElement('style');
    document.head.appendChild(injectedStyles);
  }
  injectedStyles.innerHTML = css;
}


attachSettingsUIListeners();
function attachSettingsUIListeners() {
  Array.from(
    document.querySelectorAll('.theme-colors input[type="color"]')
  ).forEach(input => {
    input.addEventListener('input', handleColorInputInput);
    input.addEventListener('change', handleColorInputChange);
  });
}
function handleColorInputInput(evt) {
  var input = evt.target;
  var id = input.id.toString().split('_');
  var themeName = id[0];
  var themeKey;
  if(id.length === 2) {
    if(id[1] == 'fg') {
      themeKey = 'textcolor';
    } else if(id[1] == 'bg') {
      themeKey = 'accentcolor';
    }
  } else if(id.length === 3) {
    if(id[1] == 'fg') {
      themeKey = 'toolbar_text';
    } else if(id[1] == 'bg') {
      themeKey = 'toolbar';
    }
  } else { return; }
  console.log(themeName, themeKey, input.value);
  changeThemeColor(themeName, themeKey, input.value);
}
function handleColorInputChange(evt) {
  //handleColorInputInput(evt);
  notifyBackgroundScript();
}
function changeThemeColor(themeName, themeKey, colorValue) {
  currentThemes[themeName].colors[themeKey] = colorValue;
  updateThemesStorage().then(function() {
    updateTheme();
  });
}

async function updateThemesStorage() {
  var themes = await browser.storage.local.set({themes: currentThemes});
  return themes;
}

function notifyBackgroundScript() {
  try {
    console.log(currentThemes);
    browser.runtime.sendMessage({themes:currentThemes});
  } catch(e) {
    console.error(e);
  }
}

function updateSettingsUI(themes) {
  var inputs = Array.from(
    document.querySelectorAll('.theme-colors input[type="color"]')
  );
  inputs.forEach((input, index) => {
    var themeName,

    inputRow = Math.floor(index/4);
    switch(inputRow) {
      case 0:
      themeName = 'day';
      break;
      case 1:
      themeName = 'night'
      break;
      case 2:
      themeName = 'incognito'
      break;
    }

    var theme = themes[themeName];
    var id = input.id.toString();
    if(id.indexOf('bg_alt') >= 0) {
      color = theme.colors.toolbar
    } else if (id.indexOf('fg_alt') >= 0) {
      color = theme.colors.toolbar_text
    } else if (id.indexOf('bg') >= 0) {
      color = theme.colors.accentcolor
    } else if (id.indexOf('fg') >= 0) {
      color = theme.colors.textcolor
    }
    if(color) {
      input.value = color;
    }
  });
}
