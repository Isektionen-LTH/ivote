import { createStore, combineReducers, applyMiddleware  } from 'redux';

import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import {
	UPDATE_RESULTS
} from './results.actions';

function results(state = [], action) {
	switch (action.type) {
	case UPDATE_RESULTS:
		return action.results;
	default:
		return state;
	}
}

const reducer = combineReducers({
	results
});

const store = createStore(reducer, applyMiddleware(
	thunk
	// , createLogger()
));

export default store;