import { createStore, combineReducers, applyMiddleware  } from 'redux';

import thunk from 'redux-thunk';

import {
	REQUEST_VOTES,
	RECIEVE_VOTES,

	EDIT_VOTE
} from './configure-votes.actions';

function editing(state = null, action) {
	switch (action.type) {
	case EDIT_VOTE:
		return action.vote;
	default:
		return state;
	}
}

function votes(state = null, action) {
	switch (action.type) {
	case REQUEST_VOTES:
		return null;
	case RECIEVE_VOTES:
		return action.votes;
	default:
		return state;
	}
}

const reducer = combineReducers({
	editing,
	votes
});
// TODO göra state till en egen istället för att ha en session

const store = createStore(reducer, applyMiddleware(
	thunk
	// , createLogger()
));

export default store;