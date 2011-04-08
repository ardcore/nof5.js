(function(global) {

	var http = require('http'),
		exec = require('child_process').exec,
		fs = require('fs'),
		port = 54321,
		io = require('socket.io'),
		ioListener,
		server;

	server = http.createServer();
	server.listen(port);
	ioListener = io.listen(server);

	ioListener.on('connection', function(client) {
		// TODO send and display message about estabilished connection
	});

	exec('find `pwd` -name *.css', function(err, stdout) {
		if (err) throw "Error finding CSS files.";
		stdout = stdout.trim();
		if (stdout) {
			stdout.split("\n").forEach(spawnWatcher);
		}
	});

	function spawnWatcher(target) {
		console.log("watching " + target);
		fs.watchFile(target, {persistent: true, interval: 100}, function(current, previous) {
			console.log("changed: " + target)
			if (ioListener) {
				ioListener.broadcast({changed: target});
			}
		})
	};

}(this));