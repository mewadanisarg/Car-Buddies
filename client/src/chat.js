import { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Chat() {
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
                {chatMessages.map((message, index) => {
                    const { id, img_url, first_name, last_name, created_at } =
                        message;
                    return (
                        <>
                            <div>
                                <img
                                    src={img_url}
                                    alt={`${first_name} ${last_name}`}
                                />
                                <h4>
                                    <Link to={`/user/${id}`}>
                                        {" "}
                                        {first_name} {last_name}{" "}
                                    </Link>
                                    <span>{created_at}</span>
                                </h4>
                                <p key={index}>{message.message}</p>
                            </div>
                        </>
                    );
                })}
            </div>
            <textarea
                onKeyDown={handleKeyDown}
                placeholder="Please add your chats here"
            ></textarea>
        </div>
    );
}
