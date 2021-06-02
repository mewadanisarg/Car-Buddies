import { socket } from "./sockets";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function Private({ id, first }) {
    const [show, setShow] = useState(false);
    const privateMessage = useSelector(
        (state) => state.private && state.private
    );
    const elemRef = useRef();
    const privatemsg = useSelector(
        (state) => state.privatemsg && state.privatemsg
    );

    useEffect(() => {
        if (id && !show) {
            socket.emit("get recent private messages", {
                id: id,
            });
            setShow(true);
        }

        const newScrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        elemRef.current.scrollTop = newScrollTop;
    }, [privatemsg, id]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("private message", {
                message: e.target.value,
                recipient_id: id,
            });
            e.target.value = "";
        }
    };
    return (
        <>
            <div className="private-chat-container" ref={elemRef}>
                <h3 className="chatting-to">Chat with {first}</h3>
                {privateMessage &&
                    privateMessage.map((privateMessage, index) => (
                        <div className="" key={index}>
                            <Link to={`/user/${privateMessage.sender_id}`}>
                                <p className="textPrivate">
                                    {privateMessage.first_name}
                                    {"  "}
                                </p>
                            </Link>
                            <p className="privateMessage">
                                {privateMessage.message}
                            </p>
                        </div>
                    ))}
            </div>
            <textarea
                placeholder="Private Message"
                className="pvt-chat-txtarea"
                onKeyDown={keyCheck}
            ></textarea>
        </>
    );
}
