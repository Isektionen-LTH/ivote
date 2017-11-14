import React from 'react';

import { Link } from 'react-router';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

export default function IndexPage() {
	return (
		<Paper className="index-page">
			<h1>Välkommen till IVote</h1>
			<div>
				<Link to={'/vote'}>Rösta</Link>
			</div>
			<div>
				<Link to={'/login'}>Logga in som admin</Link>
			</div>
			<div style={{ marginTop: 20 }}>
				Admin:
				<div>
					<Link to={'/admin/users'}>Användare</Link>
				</div>
				<div>
					<Link to={'/results'}>Resultat</Link>
				</div>
			</div>
		</Paper>
	);
}