
export const SET_SELECTED = 'SET_SELECTED';

export function setSelected(selected) {
	return {
		type: SET_SELECTED,
		selected
	};
}

export const REQUEST_VOTE_STATE = 'REQUEST_VOTE_STATE';

export function requestVoteState() {
	return {
		type: REQUEST_VOTE_STATE
	};
}

export const RECIEVE_VOTE_STATE = 'RECIEVE_VOTE_STATE';

export function recieveVoteState(response) {
	return {
		...response,
		type: RECIEVE_VOTE_STATE
	};
}

export const FETCH_VOTE_STATE = 'FETCH_VOTE_STATE';

export function fetchVoteState() {
	return (dispatch) => {
		dispatch(requestVoteState());

		return fetch('/currentvote')
			.then(response => response.json())
			.then((json) => {
				dispatch(recieveVoteState(json));
			});
	};
}

export const SEND_VOTE = 'SEND_VOTE';

export function sendVote(option) {
	return (dispatch) => {
		dispatch(requestVoteState());

		// return fetch({
		// 	url: '/vote',
		// 	method: 'POST',
		// 	body: option
		// })
		return fetch('/vote', { method: 'POST', body: option })
		.then(response => response.json())
		.then((json) => {
			dispatch(recieveVoteState(json));
		});
	};
}


export const UPDATE_SESSION = 'UPDATE_SESSION';

export function updateSession(session) {
	return {
		type: UPDATE_SESSION,
		session: session
	};
}

export const UPDATE_ONGOING_VOTE = 'UPDATE_ONGOING_VOTE';

export function updateOngoingVote(voted) {
	return {
		type: UPDATE_ONGOING_VOTE,
		voted: voted
	};
}