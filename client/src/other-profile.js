// import React from "react";
import axios from "./axios";
import FriendButton from "./friends-btn";
import { socket } from "./socket";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
let newDate = new Date();
import OthersGallery from "./other-gallery";

export default function OtherProfile(props) {
    const [user, setUser] = useState({});
    const elemRef = useRef();
    const privateMessage = useSelector(
        (state) => state.private && state.private
    );
    console.log("Private Message", privateMessage);

    useEffect(() => {
        (async () => {
            const { id } = props.match.params;
            // Private Chat on others Profile Page..!
            socket.emit("get ten recent private messages", {
                id: id,
            });
            //----------------------------------------------//
            // console.log("OtherProfile is Mounted..! Wohoo");
            console.log("id: ", id);
            // console.log("this.props in OtherProfile: ", props);
            try {
                const { data } = await axios.get(`/other-user/${id}`);
                // console.log("Data from OtherProfile Get req:", data);
                setUser({
                    first: data.first_name,
                    last: data.last_name,
                    imgUrl: data.img_url,
                    bio: data.bio,
                });
                console.log("this.state:", user);
            } catch (error) {
                console.log(
                    "Error is ComponentDidMount of OtherProfile:",
                    error
                );
                props.history.push("/");
            }
        })();
    }, []);
    useEffect(() => {
        if (elemRef.current) {
            console.log("Mounted UseEffect in chat");
            console.log(
                "elemRef.current.scrollTop: ",
                elemRef.current.scrollTop
            );
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
        }
    }, [privateMessage]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // stop the cursor to put on the new line
            // console.log("socket:", socket);
            // console.log("e.target.value", e.target.value);
            const data = {
                message: e.target.value,
                recipient_id: props.match.params.id,
            };
            socket.emit("private message", data);
            // emit to the server
            e.target.value = "";
            window.location.reload(false);
        }
    };
    return (
        <div className="others-profile-container">
            {user && (
                <>
                    <h3>Hi, {`${user.first} ${user.last}`}</h3>
                    <img src={user.imgUrl} alt={`${user.first} ${user.last}`} />
                    <h4> {user.bio} </h4>
                </>
            )}
            {/*<Link to={"/find/users"}>Search users</Link>*/}
            <FriendButton id={props.match.params.id} />
            <OthersGallery id={props.match.params.id} />
            {
                <div className="private-chat-box">
                    {privateMessage &&
                        privateMessage.map((message) => {
                            const { id, img_url, created_at } = message;
                            return (
                                <>
                                    <img
                                        className="chat-prof-image"
                                        src={img_url}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                    <h4>
                                        <Link to={`/user/${id}`}>
                                            {" "}
                                            {user.first} {user.last}{" "}
                                        </Link>
                                        <br />{" "}
                                        <p>
                                            {newDate.toLocaleString({
                                                created_at,
                                            })}
                                        </p>
                                    </h4>
                                    <p> {message.message}</p>
                                </>
                            );
                        })}
                </div>
            }
            <div>
                <textarea
                    placeholder="txtarea-chat"
                    className="txtarea-chat"
                    onKeyDown={handleKeyDown}
                ></textarea>
            </div>
        </div>
    );
}

// export default class OtherProfile extends React.Component {
//     constructor() {
//         super();
//         this.state = {};
//     }

//     async componentDidMount() {
//         const { id } = this.props.match.params;
//         // Private Chat on others Profile Page..!
//         socket.emit("get ten recent private messages", {
//             id: id,
//         });
//         //----------------------------------------------//
//         console.log("OtherProfile is Mounted..! Wohoo");
//         console.log("id: ", id);
//         console.log("this.props in OtherProfile: ", this.props);
//         try {
//             const { data } = await axios.get(`/other-user/${id}`);
//             console.log("Data from OtherProfile Get req:", data);
//             this.setState({
//                 first: data.first_name,
//                 last: data.last_name,
//                 imgUrl: data.img_url,
//                 bio: data.bio,
//             });
//             console.log("this.state:", this.state);
//         } catch (error) {
//             console.log("Error is ComponentDidMount of OtherProfile:", error);
//             this.props.history.push("/");
//         }
//     }
//     render() {
//         console.log("Render Method OtherProfile: ", this.state);
//         return (
//             <div>
//                 {this.state && (
//                     <>
//                         <h3>Hi, {`${this.state.fisrt} ${this.state.last}`}</h3>
//                         <img
//                             src={this.state.imgUrl}
//                             alt={`${this.state.first} ${this.state.last}`}
//                         />
//                         <h4> {this.state.bio} </h4>
//                     </>
//                 )}
//                 {/*<Link to={"/find/users"}>Search users</Link>*/}
//                 <FriendButton id={this.props.match.params.id} />
//             </div>
//         );
//     }
// }
