import React from 'react';
import { Provider, connect } from 'react-redux';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';

import store from './vote.store.js';

import { updateSession, setSelected } from './vote.actions.js';
// import { setSelected, fetchVoteState, sendVote } from './vote.actions.js';

import socket from '../socket';

export default function VoteRoute() {
	
	return (
		<Provider store={store}>
			<VoteSession />
		</Provider>
	);
}

class VoteSessionClass extends React.Component {
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(updateSession({ state: 'waiting' }));
	
		this.onStateUpdate = this.onStateUpdate.bind(this);
		
		socket.emit('join vote', { id: 123 });
		socket.on('state', this.onStateUpdate);
	}

	componentWillUnmount() {
		socket.emit('end vote');
		socket.off('state', this.onStateUpdate);
	}

	onStateUpdate(session) {
		const { dispatch } = this.props;

		console.log('update', session);
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
				return <CircularProgress />;
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
			session: state.session
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
					onTouchTap={() => socket.emit('vote', { option: selected})} />
			</CardActions>
		</Card>
	);
};

Vote = connect(
	(state) => {
		return {
			selected: state.selected,
			title: state.session.title
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
			options: state.session.options,
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

class HasVoted extends React.Component {
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(updateSession({ state: 'waiting' }));
	
		this.onStateUpdate = this.onStateUpdate.bind(this);
		
		socket.emit('join vote', { id: 123 });
		socket.on('state', this.onStateUpdate);
	}

	componentWillUnmount() {
		socket.emit('end vote');
		socket.off('state', this.onStateUpdate);
	}

	onStateUpdate(session) {
		const { dispatch } = this.props;

		console.log('update', session);
		dispatch(updateSession(session));
	}


	render() {
		return (
			<div>
				<div className="has-voted">Du har röstat!</div>
				<OngoingVote voted={1} total={1}></OngoingVote>
			</div>
		);
	}
}


export class OngoingVote extends React.Component {
	render() {
		return (
			<div>Hittils har {this.props.voted} av {this.props.total} personer röstat!</div>
		);
	}
}