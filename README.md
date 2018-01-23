# Features

- Replaces Firefox's New Tab -page with a custom dark themed page
- New tabs are always placed last in the tab bar
- Content modules:
  - Date & time
  - Persistent (localStorage) custom links list
  - Bookmarks list
  - Frequent sites list (topSites)
  - Changes window colors based on time of day
  - Incognito windows have a special color


# Installation
## Firefox addon package (recommended)
1. Download latest .xpi file from https://github.com/thykka/nicetab/releases
1. Drag .xpi file into Firefox and follow instructions

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
