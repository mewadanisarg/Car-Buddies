import { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendsButton({ id }) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`/friendsconnection/${id}`);
                console.log("Data from freinds button :", data);
                setButtonText(data.btnText);
            } catch (error) {
                console.log("Error in FriendsButton useState route", error);
            }
        })();
    }, []);

    const handleAddFriend = async (e) => {
        console.log("Button was clicked", handleAddFriend);
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
            setButtonText("Add Freind");
        } catch (error) {
            console.log(("Error in decling friend request", error));
        }
    };
    console.log("ButtonText:", buttonText);
    return (
        <>
            <button className="friends-btn" onClick={handleAddFriend}>
                {buttonText}
            </button>
            {buttonText === "Aceept request" && (
                <button onClick={handleDecline}>Decline request</button>
            )}
        </>
    );
}
