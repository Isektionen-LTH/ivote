import React from 'react';
// import { Link } from 'react-router';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import { withRouter } from 'react-router';
import { Route, IndexRoute } from 'react-router';

import AppBar from 'material-ui/AppBar';

import ConfigureVotes from './components/configure-votes';

let AppComponent = ({ router, children }) => {
	return (
		<div>
			<AppBar title="Admin"
				iconElementRight={<FlatButton label="Rösta" onTouchTap={() => router.push('/vote')} />} />
			<div id="container">{children}</div>
		</div>
	);
};
AppComponent = withRouter(AppComponent);

let route = <Route path="/admin" component={AppComponent}>
				<IndexRoute component={ConfigureVotes} />
			</Route>;

export default route;