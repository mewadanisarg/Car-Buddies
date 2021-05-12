import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange({ target }) {
        // console.log(target.name);
        // console.log(target.value);
        this.setState({
            [target.name]: target.value,
        });
    }
    submit(event) {
        console.log("Submit button was clicked and it is working good..!");
        event.preventDefault();
        this.setState({
            error: null,
        });
        axios
            .post("/registration", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password,
            })
            .then(() => {
                location.replace("/");
            })
            .catch((error) => {
                console.log("Error in AXIOS POST /registration route:", error);
                this.setState({
                    error: "Something went wrong, Please try again.!",
                });
            });
    }

    render() {
        // console.log("/Registration Working..! ");
        return (
            <div className="flex flex-direction-column  ">
                {this.state.error && (
                    <div className="error">
                        Oops! Somwthing went wrong.! Please try it again
                    </div>
                )}
                <label>First name</label>
                <input
                    name="first"
                    required
                    onChange={(e) => this.handleChange(e)}
                />
                <label>Last name</label>
                <input
                    name="last"
                    required
                    onChange={(e) => this.handleChange(e)}
                />
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    required
                    onChange={(e) => this.handleChange(e)}
                />
                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    required
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={(e) => this.submit(e)}>submit</button>
                <div>
                    <span>Already a member?</span>
                    <Link to="/login" className="login-route" href="#">
                        Login
                    </Link>
                </div>
            </div>
        );
    }
}
