
export const SET_SELECTED = 'SET_SELECTED';

export function setSelected(selected) {
	return {
		type: SET_SELECTED,
		selected
	};
}


export const FETCH_VOTES = 'FETCH_VOTES';

export function fetchVotes() {
	return (dispatch) => {
		dispatch(requestVotes());

		return fetch('/admin/votes')
			.then(response => response.json())
			.then((json) => {
				dispatch(recieveVotes(json));
			});
	};
}

export const REQUEST_VOTES = 'REQUEST_VOTES';

function requestVotes() {
	return {
		type: REQUEST_VOTES
	};
}

export const RECIEVE_VOTES = 'RECIEVE_VOTES';

function recieveVotes(json) {
	return {
		type: RECIEVE_VOTES,
		votes: json
	};
}