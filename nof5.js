(function(global) {

	var http = require('http'),
		exec = require('child_process').exec,
		fs = require('fs'),
		port = 54321,
		io = require('socket.io'),
		ioListener,
		targets = [];

	var tempTarget = process.argv[2];

	var server = http.createServer();
	server.listen(port);
	ioListener = io.listen(server);

	ioListener.on('connection', function(client) {
		console.log("connected");
	});

	exec('find `pwd` -name *.css', function(err, stdout) {
		if (err) throw "Error finding CSS files.";
		stdout = stdout.trim();
		if (stdout) {
			targets = stdout.split("\n")
		}
		targets.forEach( function(el) {
			spawnWatcher(el);
		})
	})

	function spawnWatcher(target) {
		console.log("watching " + target);
		fs.watchFile(target, {persistent: true, interval: 100}, function(current, previous) {
			console.log("changed: " + target)
			if (ioListener) {
				ioListener.broadcast({changed: target});
			}
		})
	}


}());