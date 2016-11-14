import React from 'react';
// import { Link } from 'react-router';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import { withRouter, Link } from 'react-router';

import loginLogout from './login-logout';

import AppBar from 'material-ui/AppBar';
let AppComponent = ({ router, children }) => {

	return (
		<div>
			<AppBar title="IVote"
				iconElementRight={loginLogout(router)}
				onTitleTouchTap={() => router.push('/')}
				titleStyle={{cursor: 'pointer'}}
				/>
			<div id="container">{children}</div>
		</div>
	);
};
AppComponent = withRouter(AppComponent);

export default AppComponent;