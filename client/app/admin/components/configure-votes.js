import React from 'react';
import { Provider, connect } from 'react-redux';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

import EditVote from './edit-vote';
import VoteActions from './vote-actions';

import { 
	fetchVotes,
	addNewVote
} from './configure-votes.actions';

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
	const subtitle = () => {
		switch (status) {
		case 'ongoing':
			return 'Pågående';
		case 'completed':
			return 'Avslutad';
		case 'waiting':
			return 'Inaktiv';
		}
	};
	

	return (
		<Card className="card">
			<CardTitle title={title} subtitle={subtitle()} />
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
