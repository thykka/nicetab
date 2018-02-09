var ip = IP();

function IP() {
  var ip = {
    element: document.querySelector('.ipaddress--ext')
  };
  ip.getExternal = function() {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://icanhazip.com', true);
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        ip.element.innerText = this.response;
      }
    };
    request.onerror = function() {
      console.error(arguments);
    };
    request.send();
  }
  ip.init = function() {
    ip.getExternal();
    return ip;
  };
  return ip.init();
}
