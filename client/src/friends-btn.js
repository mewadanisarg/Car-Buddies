import { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendsButton({ id }) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`/friendsconnection/${id}`);
                // console.log("Data from freinds button :", data);
                setButtonText(data.btnText);
            } catch (error) {
                console.log("Error in FriendsButton useState route", error);
            }
        })();
    }, []);

    const handleAddFriend = async (e) => {
        // console.log("Button was clicked", handleAddFriend);
        e.preventDefault();
        try {
            await axios.post("/friendsconnection", {
                btnText: buttonText,
                connectingUser: id,
            });
            setButtonText("Add Friend");
        } catch (error) {
            console.log("Error in adding friend request", error);
        }
    };

    const handleDecline = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/freindsconnection", {
                btnText: "Decline request",
                connectingUser: id,
            });
            setButtonText("Add Friend");
        } catch (error) {
            console.log(("Error in decling friend request", error));
        }
    };
    // console.log("ButtonText:", buttonText);
    return (
        <>
            <button
                className="friends-btn active:outline-none bg-gray-200 font-bold rounded-full w-3/5 mt-6 p-2 duration-200 hover:bg-gray-300 hover:text-gray-700"
                onClick={handleAddFriend}
            >
                {buttonText}
            </button>
            {buttonText === "Accept request" && (
                <button onClick={handleDecline}>Decline request</button>
            )}
        </>
    );
}
