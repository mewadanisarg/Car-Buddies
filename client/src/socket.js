import io from "socket.io-client";

import { chatMessages, chatMessage, privateMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));
    }

    socket.on("private messages", (message) => {
        console.log("private Mesaage from action.js", message);
        store.dispatch(privateMessage(message));
    });

    socket.on("sent message", (message) => {
        store.dispatch(privateMessage(message));
    });

    socket.on("recent messages incoming", (message) => {
        console.log("recent messages recevied", message);
        store.dispatch(privateMessage(message));
    });
};
