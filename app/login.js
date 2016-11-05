const express = require('express');
const router = express.Router();

const credentials = require('../credentials.json');
const salt = 'ivote';

router.get('/voter/:id', function(req, res) {
	res.cookie('userId', req.params.id);
	res.redirect('/vote');
});

router.get('/admin', function(req, res) {
	if(matchingCredentials(req.cookies, credentials.admin)) {
		res.redirect('/admin');
	} else {
		res.redirect('/login');
	}
})

router.get('/register', function(req, res) {
	if(matchingCredentials(req.cookies, credentials.register)) {
		res.redirect('/register');
	} else {
		res.redirect('/login');
	}

});

function auth(req, res, next) {
	if (!req.cookies) { return next(); }
	if(req.cookies.userId) {
		req.userId = req.cookies.userId;
		req.role = 'voter';
	} else if(req.cookies.username && req.cookies.hash) {
		if(matchingCredentials(req.cookies, credentials.admin)) {
			req.role = 'admin';
		} else if(matchingCredentials(req.cookies, credentials.register)) {
			req.role = 'register';
		}
	}
	next();
}

function matchingCredentials(cookie, credentials) {
	return cookie.username === credentials.username
		&& +cookie.hash === hash(credentials.password + salt);
}

function hash(string) {
  var hash = 0, i, chr, len;
  if (string.length === 0) return hash;
  for (i = 0, len = string.length; i < len; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

module.exports = {
	router: router,
	auth: auth
};
