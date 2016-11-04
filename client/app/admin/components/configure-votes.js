import React from 'react';
import { Provider, connect } from 'react-redux';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

import { fetchVotes, startVote, deleteVote, cancelCurrent, addNewVote, editVote, cancelEditing } from './configure-votes.actions';
import store from './configure-votes.store';

import 'whatwg-fetch';

export default function ConfigureVotesRoute() {
	
	return (
		<Provider store={store}>
			<ConfigureVotes />
		</Provider>
	);
}

class ConfigureVotesClass extends React.Component {
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(fetchVotes());
	}

	render() {
		const { votes, editing, dispatch } = this.props;		

		if (votes === null) {
			return (
				<div className="loading-container">
					<CircularProgress />
				</div>
			);
		}

		const existsOngoingVote = votes.filter(({ status }) => status === 'ongoing').length > 0;

		const addButton = () => (
			<FloatingActionButton className="add-vote" onTouchTap={() => dispatch(addNewVote())}>
				<ContentAdd />
			</FloatingActionButton>
		);
		return (
			<div>
				{editing === null
					? addButton()
					: <EditVote />}
				{votes.map(({ title, id, options, status }) =>
					<AdminVote
						key={id}
						id={id}
						title={title}
						options={options}
						status={status}
						existsOngoingVote={existsOngoingVote} />
				)}
			</div>
		);
	}
}

const ConfigureVotes = connect(
	(state) => {
		return {
			votes: state.votes,
			editing: state.editing
		};
	}
)(ConfigureVotesClass);

const AdminVote = ({ title, options, status, id, existsOngoingVote }) => {
	return (
		<Card className="card">
			<CardTitle title={title} subtitle={status} />
			<CardText>
			<div>
				{options.map((name => 
					<div key={name}>{name}</div>
				))}
			</div>
			</CardText>
			<CardActions className="card-actions">
				<VoteActions status={status} id={id} existsOngoingVote={existsOngoingVote} />
			</CardActions>
		</Card>
	);
};

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

VoteActions = connect()(VoteActions);

let EditVote = ({ editing, dispatch }) => {
	if (editing === null) {
		return null;
	}

	return (
		<Paper className="card" style={{padding: 16}}>
			<div>
				<TextField floatingLabelText="Titel" value={editing.title} />
			</div>
			
			<div>
				<TextField floatingLabelText="Alternativ 1" />
			</div>
			<div>
				<IconButton>
					<ContentAdd />
				</IconButton>
			</div>
			<div className="card-actions">
				<FlatButton
					label="Avbryt"
					secondary={true}
					onTouchTap={() => dispatch(cancelEditing())} />
				<FlatButton
					label="Lägg till"
					primary={true}
					onTouchTap={() => {}} />
			</div>
		</Paper>
	);
};
EditVote = connect(
	(state) => ({
		editing: state.editing
	})
)(EditVote);
