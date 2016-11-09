import React from 'react';
// import { Link } from 'react-router';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import { withRouter, Link } from 'react-router';

import loginLogout from './login-logout';

import AppBar from 'material-ui/AppBar';
let AppComponent = ({ router, children }) => {

	let navigation = null;
	if (router.isActive('/results')) {
		navigation = <FlatButton label="Rösta" onTouchTap={() => router.push('/vote')} />;
	} else if (router.isActive('/vote')) {
		navigation = <FlatButton label="Resultat" onTouchTap={() => router.push('/results')} />;
	} else if (router.isActive('/')) {
		navigation = loginLogout(router);
	}

	return (
		<div>
			<AppBar title="IVote"
				iconElementRight={navigation}
				onTitleTouchTap={() => router.push('/')}
				titleStyle={{cursor: 'pointer'}}
				/>
			<div id="container">{children}</div>
		</div>
	);
};
AppComponent = withRouter(AppComponent);

export default AppComponent;