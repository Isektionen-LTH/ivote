import React from 'react';

import { withRouter } from 'react-router';
import { getCookie } from './cookie';
import FlatButton from 'material-ui/FlatButton';

export default function loginLogout(router) {
	
	const username = getCookie('username');

	const loggedIn = !!getCookie('userId') || (!!username && !!getCookie('hash'));
	
	return loggedIn
		? <FlatButton label={`Logga ut ${username}`} onTouchTap={() => window.location = '/logout'} />
		: <FlatButton label="Logga in" onTouchTap={() => router.push('/login')} />;
}
