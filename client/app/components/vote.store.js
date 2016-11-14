import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

// import {
// 	SET_SELECTED,
// 	REQUEST_VOTE_STATE,
// 	RECIEVE_VOTE_STATE
// } from './vote.actions';

// function currentVote(state = {}, action) {
// 	switch (action.type) {
// 	case REQUEST_VOTE_STATE:
// 		return {};
// 	case RECIEVE_VOTE_STATE:
// 		return action.currentVote || {};
// 	default:
// 		return state;
// 	}
// }

// function currentState(state = 'loading', action) {
// 	switch (action.type) {
// 	case REQUEST_VOTE_STATE:
// 		return 'loading';
// 	case RECIEVE_VOTE_STATE:
// 		return action.currentState;
// 	default:
// 		return state;
// 	}
// }

import {
	SET_SELECTED,
	UPDATE_SESSION,
	UPDATE_ONGOING_VOTE,
	SET_OPTION_SELECTED
} from './vote.actions';

function singleSelected(state = '', action) {
	switch (action.type) {
	case SET_SELECTED:
		return action.selected;
	case UPDATE_SESSION:
		if (action.session.state === 'voting' && action.session.numberOfChoices === 1) {
			return action.session.options[0];
		} else {
			return state;
		}
	default:
		return state;
	}
}

function contains(array, item) {
	return array.indexOf(item) !== -1;
}
function multipleSelected(state = [], action) {
	switch (action.type) {
	case SET_OPTION_SELECTED:
		if (contains(state, action.option)) {
			// Remove option
			return state.filter(x => x !== action.option);
		} else {
			// Add option
			return [...state, action.option];
		}
	case UPDATE_SESSION:
		if (action.session.state === 'voting' && action.session.numberOfChoices > 1) {
			return [];
		} else {
			return state;
		}
	default:
		return state;
	}
}

function voteSession(state = {state: 'loading'}, action) {
	switch (action.type) {
	case UPDATE_SESSION:
		return action.session;
	default:
		return state;
	}
}

function ongoingVote(state = {voted: 0, total: 0}, action) {
	switch (action.type) {
	case UPDATE_ONGOING_VOTE:
		return action.ongoingVote;
	case UPDATE_SESSION:
		if (action.session.state === 'voted') {
			return {
				total: action.session.total,
				voted: action.session.voted
			};
		} else {
			return state;
		}
	default:
		return state;
	}
}

const reducer = combineReducers({
	singleSelected,
	multipleSelected,
	voteSession,
	ongoingVote
});
// TODO göra state till en egen istället för att ha en session

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
	applyMiddleware(
		thunk
	)
));

export default store;