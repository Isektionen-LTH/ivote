import React from 'react';
// import { Link } from 'react-router';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import { withRouter } from 'react-router';

import AppBar from 'material-ui/AppBar';
let AppComponent = ({ router, children }) => {
	const navigation = router.isActive('/results')
		? <FlatButton label="Rösta" onTouchTap={() => router.push('/vote')} />
		: <FlatButton label="Resultat" onTouchTap={() => router.push('/results')} />;
	return (
		<div>
			<AppBar title="IVote"
				iconElementRight={navigation}
				/>
			<div id="container">{children}</div>
		</div>
	);
};
AppComponent = withRouter(AppComponent);

export default AppComponent;