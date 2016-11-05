
export const FETCH_VOTES = 'FETCH_USERS';

export function fetchUsers() {
	return (dispatch) => {
		dispatch(requestUsers());

		return fetch('/admin/userlist', {method: 'GET', credentials: 'same-origin'})
			.then(response => response.json())
			.then((json) => {
				dispatch(recieveUsers(json));
			});
	};
}

export const REQUEST_USERS = 'REQUEST_USERS';

function requestUsers() {
	return {
		type: REQUEST_USERS
	};
}

export const RECIEVE_USERS = 'RECIEVE_USERS';

function recieveUsers(json) {
	return {
		type: RECIEVE_USERS,
		users: json
	};
}


export function deleteUser(id) {
	return (dispatch) => {
		return fetch(`/admin/user/${id}`, { method: 'DELETE', credentials: 'same-origin' })
			.then(response => response.json())
			.then((json) => {
				dispatch(recieveUsers(json));
			});
	};
}