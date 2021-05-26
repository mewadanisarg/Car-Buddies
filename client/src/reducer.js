export default function reducer(state = {}, action) {
    if (action.type === "FRIENDS_REQUESTS") {
        state = {
            ...state,
            arrayofFriendRequest: action.arrayofFriendRequest,
        };
    }
    if (action.type === "ACCEPT_REQUEST") {
        state = {
            ...state,
            arrayofFriendRequest: state.arrayofFriendRequest.map((user) => {
                if (user.id === action.id) {
                    return {
                        ...user,
                        accepted: true,
                    };
                } else {
                    return user;
                }
            }),
        };
    }
    if (action.type === "UNFRIEND_USER") {
        state = {
            ...state,
            arrayofFriendRequest: state.arrayofFriendRequest.filter(
                (user) => user.id !== action.id
            ),
        };
    }

    return state;
}
