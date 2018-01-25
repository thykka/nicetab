Clock();
function Clock() {
  var c = {
    el: {
      hour:   document.querySelector('.time__hours'),
      minute: document.querySelector('.time__minutes'),
      second: document.querySelector('.time__seconds'),
      day:    document.querySelector('.time__day'),
      month:  document.querySelector('.time__month'),
      year:   document.querySelector('.time__year')
    }
  };
  c.update = function(t) {
    var now = new Date();
    c.el.hour.innerText = now.getHours();
    c.el.minute.innerText = ("0" + now.getMinutes()).substr(-2);
    c.el.second.innerText = ("0" + now.getSeconds()).substr(-2);

    c.el.day.innerText = ("0" + now.getDate()).substr(-2);
    c.el.month.innerText = ("0" + now.getMonth() + 1).substr(-2);
    c.el.year.innerText = now.getFullYear();
  };
  c.stop = function() {
    if(!!c.interval) {
      clearInterval(c.interval);
    }
  };
  c.start = function() {
    c.interval = setInterval(c.update, 1000);
  };
  c.start();
  c.update();
  return c;
}
