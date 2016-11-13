import React from 'react';
import { Provider, connect } from 'react-redux';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import Checkbox from 'material-ui/Checkbox';

import store from './vote.store.js';

import { updateSession, setSelected, updateOngoingVote, setOptionSelected } from './vote.actions.js';
// import { setSelected, fetchVoteState, sendVote } from './vote.actions.js';

import socket from '../socket';
import { getCookie } from '../cookie';

export default function VoteRoute() {

	return (
		<Provider store={store}>
			<VoteSession />
		</Provider>
	);
}

const id = getCookie('userId');

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

	render() {
		const { session } = this.props;

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
		case 'no id':
			return <h1>Du måste registrera dig för att rösta!</h1>;
		}
	}

}
const VoteSession = connect(
	(state) => {
		return {
			session: state.voteSession
		};
	}
)(VoteSessionClass);

let Vote = ({ title, selected, numberOfChoices }) => {
	const multipleChoice = numberOfChoices > 1;
	return (
		<Card className="card">
			<CardTitle
				title={title}
				subtitle={multipleChoice ? `Du kan rösta på ${numberOfChoices} alternativ` : null}/>
			<CardText>
				{multipleChoice
					? <MultipleVoteList />
					: <SingleVoteList />}
				
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
		const { numberOfChoices } = state.voteSession;
		const multipleChoice = numberOfChoices > 1;
		return {
			selected: multipleChoice ? state.multipleSelected : state.singleSelected,
			title: state.voteSession.title,
			numberOfChoices
		};
	}
)(Vote);

let SingleVoteList = ({ options, selected, onSelect }) => {
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
SingleVoteList = connect(
	(state) => {
		return {
			options: state.voteSession.options,
			selected: state.singleSelected
		};
	},
	(dispatch) => {
		return {
			onSelect: (selected) => {
				dispatch(setSelected(selected));
			}
		};
	}
)(SingleVoteList);

let MultipleVoteList = ({ options, selected, numberOfChoices, dispatch }) => {

	console.log(selected);
	const isChecked = (option) => {
		return selected.indexOf(option) !== -1;
	};

	const isDisabled = (option) => {
		return !isChecked(option) && selected.length === numberOfChoices;
	};

	return (
		<div>
			{options.map(option =>
				<Checkbox
					key={option}
					label={option}
					value={option}
					checked={isChecked(option)}
					disabled={isDisabled(option)}
					onCheck={(e, checked) => {
						dispatch(setOptionSelected(option, checked));
					}}
				/>
			)}
		</div>
	);
};
MultipleVoteList = connect(
	(state) => {
		return {
			options: state.voteSession.options,
			selected: state.multipleSelected,
			numberOfChoices: state.voteSession.numberOfChoices
		};
	}
)(MultipleVoteList);

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
			<div>Hittills har {voted} av {total} personer röstat!</div>
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
