function loadScript(url, callback) {
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.src = url;
  var done = false;
  script.onload = script.onreadystatechange = function() {
    if (!done && ( !this.readyState
      || this.readyState == "loaded"
      || this.readyState == "complete")) {
      done = true;
      callback();
      script.onload = script.onreadystatechange = null;
      head.removeChild(script);
    }
  };
  head.appendChild(script);
};

function reCss() {
  var i, a, s;
  a = document.getElementsByTagName('link');
  for (i = 0; i < a.length; i++) {
    s = a[i];
    if (s.rel.toLowerCase().indexOf('stylesheet') >= 0 && s.href) {
      var h = s.href.replace(/(&|\?)forceReload=\d+/, '');
      s.href = h + (h.indexOf('?') >= 0 ? '&' : '?') + 'forceReload=' + (new Date().valueOf())
    }
  }
};

loadScript("http://cdn.socket.io/stable/socket.io.js", function() {
  var socket = new io.Socket('localhost', { port: 54321, transports: ['websocket', 'flashsocket', 'xhr-polling', 'htmlfile'] });
  socket.connect();
  socket.on('message', function(msg) {
    if (msg.changed) {
      console.log("change in " + msg.changed);
      reCss();
    }
  });
});