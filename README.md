# Features

- Replaces Firefox's New Tab -page with a custom dark themed page
- New tabs are always placed last in the tab bar
- Toggleable content modules:
  - Date, time and current external IP
  - NASA Astronomy Picture Of the Day
  - Persistent custom links list
  - Bookmarks list
  - Frequent sites list (topSites)
- Switches between custom color themes based on time of day, or when in incognito mode

# Screenshots

- ![Default day color scheme](examples/screenshot-0.1.6-default-theme.png?t=latest)

- ![Default incognito color scheme](examples/screenshot-0.1.6-incognito.png?t=latest)

- ![Customized New Tab view](examples/screenshot-0.1.4-customized-view.png?t=latest)


# Installation
## Firefox addon package (recommended)
1. Click to download latest .xpi file from https://github.com/thykka/nicetab/releases
1. Firefox will prompt to install the extension

## From source
1. Clone this repo
1. Go to Firefox' Add-on developer settings ([about:debugging](about:debugging))
1. Click 'Load Temporary Add-on' and select manifest.json

# Usage
## Persistent custom links list

- Add new links:
  1. click the input box
  1. type or paste the address, press enter
  1. type a name for the link
  1. press enter to save the custom link
  - to cancel, press ESC while input box is focused

- Remove custom links by first hovering one, then clicking the × beside it.

- Hide/show modules
  1. Move cursor to the inner right edge of a module. A [X] button will appear
  1. Click the button to hide the module. Module turns into a thin line
  1. Click the thin line to show a module again

- Customize theme
  1. Move cursor to the bottom edge of the window. The toolbar will appear
  1. The toolbar has 3 sets of swatches; for day mode, night mode and incognito mode, respectively
  1. Change colors by clicking on the swatches

- Disable theme switching
  - Not currently possible, although one can manually unify each theme's colors as a workaround.
