import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

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
	REMOVE_EDIT_OPTION,
	SET_NUMBER_OF_CHOICES
} from './configure-votes.actions';

function editing(state = null, action) {
	switch (action.type) {
	case ADD_NEW_VOTE:
		return {title: '', options: ['', ''], numberOfChoices: 1};
	case EDIT_VOTE:
		return action.vote;
	case CANCEL_EDITING: // Fallthrough
	case SAVE_VOTE:
		return null;
	case ADD_EDIT_OPTION:
		return {
			...state,
			options: [...state.options, action.value]
		};

	case EDIT_TITLE_CHANGED:
		return {
			...state,
			title: action.title
		};
	case EDIT_OPTION_CHANGED:
		if (action.index === state.options.length) {
			return {
				...state,
				options: state.options.concat(action.option)
			};
		} else {
			return {
				...state,
				options: state.options.map((option, i) => i === action.index ? action.option : option)
			};
		}
	case REMOVE_EDIT_OPTION:
		// If there are more choices than options after deletion
		const numberOfChoices = state.numberOfChoices === state.options.length - 1
			? Math.max(state.options.length - 2, 1)
			: state.numberOfChoices;
		
		return {
			...state,
			options: state.options.filter((option, i) => i !== action.index),
			numberOfChoices: numberOfChoices
		};
	case SET_NUMBER_OF_CHOICES:
		return {
			...state,
			numberOfChoices: action.numberOfChoices
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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
	applyMiddleware(
		thunk
	)
));
export default store;