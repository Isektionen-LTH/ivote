import React from 'react';
import { connect } from 'react-redux';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

import { 
	startVote,
	deleteVote,
	cancelCurrent,
	editVote
} from './configure-votes.actions';

let VoteActions = ({ status, id, dispatch, existsOngoingVote }) => {
	switch (status) {
	case 'ongoing':
		return (
			<FlatButton
				label="Avsluta"
				primary={true}
				onTouchTap={() => dispatch(cancelCurrent())} />
		);
	case 'completed':
		return null;
	case 'waiting':
		const editButton = (
			<FlatButton
				label="Ändra"
				secondary={true}
				onTouchTap={() => dispatch(editVote(id))} />
		);
		const deleteButton = (
			<FlatButton
				label="Ta bort"
				secondary={true}
				onTouchTap={() => dispatch(deleteVote(id))} />
		);
		if (existsOngoingVote) {
			return (
				<div>
					{deleteButton}
					{editButton}
				</div>
			);
		} else {
			return (
				<div>
					{editButton}
					<FlatButton
						label="Påbörja"
						primary={true}
						onTouchTap={() => dispatch(startVote(id))} />
					{deleteButton}
				</div>
			);
		}
	}
};

export default VoteActions = connect()(VoteActions);