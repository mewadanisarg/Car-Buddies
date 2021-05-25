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

    useEffect(() => {
        dispatch(seeFriendsRequest());
    }, []);
    return <h1>A friend list</h1>;
}
