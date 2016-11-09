import React from 'react';
// import { Link } from 'react-router';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';

import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/exit-to-app';

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
		<Toolbar>
			<ToolbarGroup firstChild={true}>
				<ToolbarTitle text="IVote" />
			</ToolbarGroup>
			<ToolbarGroup>
				<ToolbarTitle
					text="Du är inloggad som John Rapp"
					style={{fontSize: '16px'}} />
				<IconButton tooltip="Logga ut">
					<ActionHome />
				</IconButton>
				<ToolbarSeparator />
				<FlatButton style={{color: 'white'}} label="Rösta" />
			</ToolbarGroup>
		</Toolbar>
	);

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