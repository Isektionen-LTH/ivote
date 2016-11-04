import { createStore, combineReducers, applyMiddleware  } from 'redux';

import thunk from 'redux-thunk';

import {
	REQUEST_VOTES,
	RECIEVE_VOTES,

	ADD_NEW_VOTE,
	EDIT_VOTE,
	SAVE_VOTE,
	CANCEL_EDITING,
	ADD_EDIT_OPTION,

	EDIT_TITLE_CHANGED,
	EDIT_OPTION_CHANGED,
	REMOVE_EDIT_OPTION
} from './configure-votes.actions';

function editing(state = null, action) {
	switch (action.type) {
	case ADD_NEW_VOTE:
		return {title: '', options: ['', '']};
	case EDIT_VOTE:
		return action.vote;
	case CANCEL_EDITING: // Fallthrough
	case SAVE_VOTE:
		return null;
	case ADD_EDIT_OPTION:
		return {
			...state,
			options: [...state.options, '']
		};

	case EDIT_TITLE_CHANGED:
		return {
			...state,
			title: action.title
		};
	case EDIT_OPTION_CHANGED:
		return {
			...state,
			options: state.options.map((option, i) => i === action.index ? action.option : option)
		};
	case REMOVE_EDIT_OPTION:
		return {
			...state,
			options: state.options.filter((option, i) => i !== action.index)
		};
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