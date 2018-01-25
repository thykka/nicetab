SectionClosers();
function SectionClosers() {
  var s = {
    selector: '.toolbar-button--close',
    closed: false
  };
  s.init = function() {
    s.buttons = Array.from(
      document.querySelectorAll(s.selector)
    );
    s.buttons.forEach(attachEvents);
    s.loadState();
    return s;
  };
  function attachEvents (button, index, buttons) {
    button.addEventListener('click', handleClick);
  }
  function handleClick (event) {
    event.preventDefault();
    event.stopPropagation();
    var section = getSection(this);
    if(isClosed(section)) {
      openSection(section);
    } else {
      closeSection(section);
    }
  }
  function getSection(button) {
    var parent = button.parentNode;
    do {
      parent = parent.parentNode;
    } while (!parent.classList.contains('section'))
    return parent;
  }
  function isClosed (section) {
    return section.classList.contains('section--closed');
  }
  function closeSection(section) {
    section.classList.add('section--closed');
    section.addEventListener('mouseup', handleSectionClick);
    s.saveState();
  }
  function openSection(section) {
    section.classList.remove('section--closed');
    section.removeEventListener('mouseup', handleSectionClick);
    s.saveState();
  }
  function handleSectionClick (event) {
    event.preventDefault();
    event.stopPropagation();
    openSection(this);
  }
  function setState (state) {
    state.forEach(function(closed, index) {
      if(closed) {
        var section = getSection(s.buttons[index]);
        closeSection(section);
      }
    });
  }
  s.saveState = function() {
    var state = s.buttons.map(el => {
      return getSection(el)
        .classList.contains('section--closed');
    });
    browser.storage.local.set({sectionClosedState:state});
  };
  s.loadState = function() {
    browser.storage.local.get('sectionClosedState')
      .then(function(res) {
        setState(res.sectionClosedState);
      });
  };
  return s.init();
}
