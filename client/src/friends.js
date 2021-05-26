import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    seeFriendsRequest,
    acceptFriendRequest,
    unfriendRequest,
} from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) =>
            state.arrayofFriendRequest &&
            state.arrayofFriendRequest.filter((user) => user.accepted)
    );

    const requests = useSelector(
        (state) =>
            state.arrayofFriendRequest &&
            state.arrayofFriendRequest.filter((user) => user.accepted === false)
    );

    useEffect(() => {
        (!friends || !requests) && dispatch(seeFriendsRequest());
    }, []);

    if (!friends || !requests) {
        return null;
    }

    return (
        <div className="friends-main-container">
            <div className="allfriends-container">
                <div className="friendsrequest-main-container">
                    <h2>Your {friends.length} friends </h2>
                    <div className="friendsrequest-grid">
                        {friends &&
                            friends.map((user) => {
                                const { id, first_name, last_name, img_url } =
                                    user;
                                console.log("wannabefreinds list: ", user);
                                return (
                                    <>
                                        <div className="other-profile">
                                            <Link key={id} to={`/user/${id}`}>
                                                <img
                                                    src={
                                                        img_url ||
                                                        "default_user.jpeg"
                                                    }
                                                    alt={`${first_name} ${last_name}`}
                                                ></img>
                                                <p>
                                                    {first_name} {last_name}
                                                </p>
                                            </Link>
                                            <button
                                                className="friends-acceptbtn-unfriendbtn"
                                                onClick={() =>
                                                    dispatch(
                                                        unfriendRequest(id)
                                                    )
                                                }
                                            >
                                                Unfriend
                                            </button>
                                        </div>
                                    </>
                                );
                            })}
                    </div>
                </div>
            </div>
            <div className="friendsrequest-main-container">
                <h2>You have {requests.length} friend request</h2>
                <div className="friendsrequest-grid">
                    {requests &&
                        requests.map((user) => {
                            const { id, first_name, last_name, img_url } = user;
                            console.log("wannabefreinds list: ", user);
                            return (
                                <>
                                    <div className="other-profile">
                                        <Link key={id} to={`/user/${id}`}>
                                            <img
                                                src={
                                                    img_url ||
                                                    "default_user.jpeg"
                                                }
                                                alt={`${first_name} ${last_name}`}
                                            ></img>
                                            <p>
                                                {first_name} {last_name}
                                            </p>
                                        </Link>
                                        <button
                                            className="friends-acceptbtn-unfriendbtn"
                                            onClick={() =>
                                                dispatch(
                                                    acceptFriendRequest(id)
                                                )
                                            }
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="friends-acceptbtn-unfriendbtn"
                                            onClick={() =>
                                                dispatch(unfriendRequest(id))
                                            }
                                        >
                                            Decline friend request
                                        </button>
                                    </div>
                                </>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
