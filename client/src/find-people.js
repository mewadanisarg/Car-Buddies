import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchField, setSearchField] = useState("");

    // Searching the latest user
    useEffect(() => {
        console.log("find-people function component mounted..!");
        console.log("useEffect is running for Lastest users");
        (async () => {
            try {
                const { data } = await axios.get("/find/users.json");
                setUsers(data);
                console.log("Req was made to GET route to fetch data:", data);
            } catch (error) {
                console.log("Error in useEffect method in find-people:", error);
            }
        })();
    }, []);

    useEffect(() => {
        console.log("useEffect is running for searching the user");
        let ignore = false;
        (async () => {
            try {
                if (searchField) {
                    console.log("searchField:", searchField);
                    const { data } = await axios.post("/find/users.json", {
                        searchField,
                    });
                    if (!ignore) {
                        setUsers(data);
                        console.log("data from getting searched names", data);
                        console.log("search names: ", searchField);
                    }
                } else {
                    console.log(
                        "Inside 'else loop' in the useEffect POST req in find-people"
                    );
                    const { data } = await axios.get("/find/users.json");
                    setUsers(data);
                }
            } catch (error) {
                console.log("Error in POST useEffect axios req: ", error);
            }
        })();
        return () => {
            ignore = true;
        };
    }, [searchField]);

    const onChange = ({ target }) => {
        setSearchField(target.value);
    };

    return (
        <>
            <div className="find-people-maincontainer">
                <h3>Search here</h3>
                <input
                    className="search-input"
                    onChange={onChange}
                    placeholder=" e.g: Mercedes A45s"
                />
                <br />
                <div className="found-people-grid">
                    {users &&
                        users.map((user, index) => {
                            console.log("user.id", user.id);
                            return (
                                <div className="newusers-photo" key={index}>
                                    <Link to={`/user/${user.id}`}>
                                        <img
                                            className="new-users-photo"
                                            src={
                                                user.img_url ||
                                                "default-user.jpeg"
                                            }
                                        />
                                        <p key={user.first_name}>
                                            {user.first_name} {user.last_name}
                                        </p>
                                    </Link>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}
