import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';

import {
	REQUEST_USERS,
	RECIEVE_USERS
} from './users.actions';

function users(state = null, action) {
	switch (action.type) {
	case REQUEST_USERS:
		return null;
	case RECIEVE_USERS:
		return action.users;
	default:
		return state;
	}
}

const reducer = combineReducers({
	users
});
// TODO göra state till en egen istället för att ha en session

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
	applyMiddleware(
		thunk
	)
));

export default store;