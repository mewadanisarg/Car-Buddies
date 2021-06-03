import axios from "./axios";

export async function seeFriendsRequest() {
    console.log("SeeFriendRequest: ");
    try {
        const { data } = await axios.get("/friendsrequest.json");
        // console.log("Data from Friends Request route: ", data);
        return {
            type: "FRIENDS_REQUESTS",
            arrayofFriendRequest: data,
        };
    } catch (error) {
        console.log("Error in axios request to /friendsrequest route", error);
    }
}

export async function acceptFriendRequest(id) {
    const btnText = "Accept request";
    // console.log("Accept Request Button CLicked");
    try {
        const { data } = await axios.post("/friendsconnection", {
            connectingUser: id,
            btnText,
        });
        console.log("Data from acceptFriendRequest of user: ", data);
        return {
            type: "ACCEPT_REQUEST",
            id,
        };
    } catch (error) {
        console.log("Error in accepting Friends Request action: ", error);
    }
}

export async function unfriendRequest(id) {
    const btnText = "Unfriend";
    try {
        const { data } = await axios.post("/friendsconnection", {
            connectingUser: id,
            btnText,
        });
        console.log("Data from Unfriend Request of user: ", data);
        return {
            type: "UNFRIEND_USER",
            id,
        };
    } catch (error) {
        console.log("Error in Unfriending user action: ", error);
    }
}

// Part 10 CHATS, recent 10 messages
export async function chatMessages(messages) {
    // console.log("Messagessss from action.js: ", messages);
    return {
        type: "CHAT_MESSAGES",
        messages,
    };
}

export async function chatMessage(message) {
    // console.log("Message from action.js: ", message);
    return {
        type: "CHAT_MESSAGE",
        message,
    };
}

export async function privateMessage(message) {
    // console.log("message from privateMessage(message) action.js: ", message);
    return {
        type: "PRIVATE_MESSAGES",
        data: message,
    };
}
