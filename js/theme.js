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

var injectedStyles;
async function fetchThemesFromStorage() {
  var themes = await browser.storage.local.get('themes');
  return themes;
}
function setTheme(themeName) {
  fetchThemesFromStorage().then(function(storage){
    var theme = storage['themes'][themeName];
    loadTheme(theme);
  });
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
function injectStyle(css) {
  if(!injectedStyles) {
    injectedStyles = document.createElement('style');
    document.head.appendChild(injectedStyles);
  }
  injectedStyles.innerHTML = css;
}
