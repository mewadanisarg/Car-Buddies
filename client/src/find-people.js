import { useState, useEffect } from "react";
import axios from "./axios";

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
                    // setUsers([]);
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
                <h3>Search for People :</h3>
                <input onChange={onChange} />
                <p>
                    Let increase the Spirit by sharing the spirit with{" "}
                    {searchField}
                </p>
                <ul>
                    {users &&
                        users.map((user, index) => {
                            return (
                                <div key={index}>
                                    <img
                                        src={
                                            user.img_url || "default-user.jpeg"
                                        }
                                    />
                                    <p key={user.first}>
                                        {user.first} {user.last}
                                    </p>
                                </div>
                            );
                        })}
                </ul>
            </div>
        </>
    );
}
