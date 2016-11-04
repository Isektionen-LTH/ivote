import React from 'react';
import { Provider, connect } from 'react-redux';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';

import store from './vote.store.js';

import { updateSession, setSelected, updateOngoingVote } from './vote.actions.js';
// import { setSelected, fetchVoteState, sendVote } from './vote.actions.js';

import socket from '../socket';

export default function VoteRoute() {
	
	return (
		<Provider store={store}>
			<VoteSession />
		</Provider>
	);
}

const id = location.search.substr(4);

class VoteSessionClass extends React.Component {
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(updateSession({ state: 'waiting' }));
	
		this.onStateUpdate = this.onStateUpdate.bind(this);
		
		socket.emit('join vote', { id: id });
		socket.on('state', this.onStateUpdate);
	}

	componentWillUnmount() {
		socket.emit('end vote');
		socket.off('state', this.onStateUpdate);
	}

	onStateUpdate(session) {
		const { dispatch } = this.props;
		dispatch(updateSession(session));
	}
	// {
	// 	state: 'wating' | 'voting' | 'voted',
	// 	options: [],
	// 	title: ''

	// }
	render() {
		const { session } = this.props;
		function currentComponent() {
			switch (session.state) {
			case 'waiting':
				return (
					<div className="loading-container">
						<CircularProgress />
					</div>
				);
			case 'voting':
				return <Vote />;
			case 'voted':
				return <HasVoted />;
			}
		}

		return currentComponent();
	}
	
}
const VoteSession = connect(
	(state) => {
		return {
			session: state.voteSession
		};
	}
)(VoteSessionClass);

let Vote = ({ title, selected, dispatch }) => {
	return (
		<Card className="card">
			<CardTitle title={title} />
			<CardText>
				<VoteList />
			</CardText>
			<CardActions className="card-actions">
				<FlatButton
					className="vote-button"
					label="Rösta"
					primary={true}
					onTouchTap={() => socket.emit('vote', selected)} />
			</CardActions>
		</Card>
	);
};

Vote = connect(
	(state) => {
		return {
			selected: state.selected,
			title: state.voteSession.title
		};
	}
)(Vote);

let VoteList = ({ options, selected, onSelect }) => {
	return (
		<RadioButtonGroup
			name="selected"
			defaultSelected={selected}
			onChange={(e) => {
				onSelect(e.target.value);
			}}>

			{options.map(option =>
				<RadioButton
					key={option}
					label={option}
					value={option}
				/>
			)}
		</RadioButtonGroup>
	);
};
VoteList = connect(
	(state) => {
		return {
			options: state.voteSession.options,
			selected: state.selected
		};
	},
	(dispatch) => {
		return {
			onSelect: (selected) => {
				dispatch(setSelected(selected));
			}
		};
	}
)(VoteList);

const HasVoted = () => {
	return (
		<div>
			<div className="has-voted">Du har röstat!</div>
			<OngoingVote></OngoingVote>
		</div>
	);
};

export class OngoingVoteClass extends React.Component {
	componentDidMount() {
		const { dispatch } = this.props;
	
		this.onVoteUpdate = this.onVoteUpdate.bind(this);
		
		socket.on('new vote', this.onVoteUpdate);
	}

	componentWillUnmount() {
		socket.off('new vote', this.onVoteUpdate);
	}

	onVoteUpdate(ongoingVote) {
		const { dispatch } = this.props;
		dispatch(updateOngoingVote(ongoingVote));
	}

	render() {
		const {voted, total} = this.props;
		return (
			<div>Hittils har {voted} av {total} personer röstat!</div>
		);
	}
}

const OngoingVote = connect(
	(state) => {
		return {
			voted: state.ongoingVote.voted,
			total: state.ongoingVote.total
		};
	}
)(OngoingVoteClass);