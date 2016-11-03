const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

['app', 'bin'].forEach(dir => app.use('/' + dir, express.static(dir)));

app.get('/bootstrap.css', function(req, res) {
	res.sendFile(path.resolve(__dirname, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'));
});

app.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname, 'index.html'));
});

http.listen(port, function() {
	console.log(`Server started on port ${port}`);
});

io.on('connection', function(socket) {

	socket.on('join vote', function({ id }) {
		socket.emit('state', {
			state: 'waiting'
		});

		setTimeout(function() {
			socket.emit('state', {
				state: 'voting',
				title: 'Ordförande',
				options: ['John', 'Kristoffer']
			});
		}, 500);

		socket.on('vote', function() {
			socket.emit('state', {
				state: 'voted'
			});

			setTimeout(function() {
				socket.emit('state', {
					state: 'waiting'
				});
			}, 1000);

			setTimeout(function() {
				socket.emit('state', {
					state: 'voting',
					title: 'Ordförande',
					options: ['Kristoffer', 'John']
				});
			}, 1500);
		});
	});
	
});