const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

['app', 'bin'].forEach(dir => app.use('/' + dir, express.static(dir)));

app.get('/bundle.js', function(req, res) {
	res.sendFile(path.resolve(__dirname, 'bin', 'app.bundle.js'));
});
app.get('/app.bundle.js.map', function(req, res) {
	res.sendFile(path.resolve(__dirname, 'bin', 'app.bundle.js.map'));
});

http.listen(port, function() {
	console.log(`Server started on port ${port}`);
});

app.get('/admin/votes', function(req, res) {
	setTimeout(function() {
		res.sendFile(path.resolve(__dirname, 'mock-data/admin.json'));
	}, 500);
});

app.get('/admin/vote/cancelcurrent', function(req, res) {
	setTimeout(function() {
		res.sendFile(path.resolve(__dirname, 'mock-data/admin.votes.json'));
	}, 500);
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
				state: 'voted',
				total: 10,
				voted: 5
			});

			setTimeout(function() {
				socket.emit('new vote', 6);
			}, 500);
			setTimeout(function() {
				socket.emit('new vote', 7);
			}, 1000);
			setTimeout(function() {
				socket.emit('new vote', 9);
			}, 2000);
			setTimeout(function() {
				socket.emit('new vote', 10);
			}, 2500);

			setTimeout(function() {
				socket.emit('state', {
					state: 'waiting'
				});
			}, 3000);

			setTimeout(function() {
				socket.emit('state', {
					state: 'voting',
					title: 'Ordförande',
					options: ['Kristoffer', 'John']
				});
			}, 3500);
		});
	});

	socket.on('join results', function() {
		socket.emit('new results', [
			{
				title: 'Ordförande',
				options: [
					{ title: 'John', numberOfVotes: 10 },
					{ title: 'Kristoffer', numberOfVotes: 3 },
					{ title: 'Oscar', numberOfVotes: 1 }
				]
			},
			{
				title: 'Överphös',
				options: [
					{ title: 'Kristoffer', numberOfVotes: 15 },
					{ title: 'John', numberOfVotes: 2 },
					{ title: 'Oscar', numberOfVotes: 1 }
				]
			},
			{
				title: 'Sexmästare',
				options: [
					{ title: 'John', numberOfVotes: 22 },
					{ title: 'Kristoffer', numberOfVotes: 15 },
					{ title: 'Oscar', numberOfVotes: 0 }
				]
			}
		]);
	});
	
});

app.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname, 'index.html'));
});