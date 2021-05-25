import { useEffect, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";

export function Chat() {
    const chatMessages = useSelector((state) => state && state.chatMessages);
    console.log("chatMessages: ", chatMessages);
    const elemRef = useRef();

    useEffect(() => {
        console.log("Mounterd UseEffect in chat");
        console.log("elemRef.current.scrollTop: ", elemRef.current.scroll);
        console.log(
            "elemRef.current.clientHeight: ",
            elemRef.current.clientHeight
        );
        console.log(
            "elemRef.current.scrollHeight: ",
            elemRef.current.scrollHeight
        );
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // stop the cursor to put on the new line
            console.log("e.target.value", e.target.value);
            socket.emit("chatmessage", e.target.value);
            // emit to the server
            e.target.value = "";
        }
    };

    console.log("elemRef: ", elemRef);
    return (
        <div className="chat-mains">
            <h1>Chit Chat Room</h1>
            <div className="chat-container">
                <p>This will the Chat Messages</p>
                <p>This will the Chat Messages</p>
                <p>This will the Chat Messages</p>
                <p>This will the Chat Messages</p>
                <p>This will the Chat Messages</p>
                <p>This will the Chat Messages</p>
                <p>This will the Chat Messages</p>
                <p>This will the Chat Messages</p>
                <p>This will the Chat Messages</p>
                <p>This will the Chat Messages</p>
            </div>
            <textarea
                onKeyDown={handleKeyDown}
                placeholder="Please add your chate here"
            ></textarea>
        </div>
    );
}
