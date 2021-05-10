import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }
    login(event) {
        console.log("Submit button was clicked and it is working good..!");
        event.preventDefault();
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password,
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((error) => {
                console.log("Error in AXIOS POST /login route:", error);
                this.setState({
                    error: "Something ent wrong, Please try again.!",
                });
            });
    }

    render() {
        console.log("Login.js route is working");
        return (
            <form>
                <div className="flex flex-direction-column ">
                    {this.state.error && (
                        <div className="error">
                            Oops! Somwthing went wrong.! Please try again
                        </div>
                    )}
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        onChange={(e) => this.handleChange(e)}
                    />
                    <label>Password</label>
                    <input
                        name="pass"
                        type="password"
                        required
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={() => this.login}>login</button>
                    <div>
                        <Link
                            to="/password/reset"
                            className="login-route"
                            href="#"
                        >
                            Reset Password
                        </Link>
                    </div>
                    <Link to="/">Sign up</Link>
                </div>
            </form>
        );
    }
}
