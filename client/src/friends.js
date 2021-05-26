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

    if (!friends || !request) {
        return null;
    }

    return (
        <div className="friends-main-container">
            <div className="">
                Friends
            </div>

        </div>
    )
}
