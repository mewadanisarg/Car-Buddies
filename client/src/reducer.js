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

    // PART-10 for last 10 messages
    if (action.type === "CHAT_MESSAGES") {
        // console.log("Woho..! Latest 10 Messages reducer is working..!");
        return {
            ...state,
            chatMessages: [...action.messages],
        };
    }
    if (action.type === "CHAT_MESSAGE") {
        console.log("Only Message state from the reducer: ", state);
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.message],
        };
    }
    if (action.type === "PRIVATE_MESSAGES") {
        state = {
            ...state,
            private: action.data.reverse(),
        };
    }

    return state;
}
