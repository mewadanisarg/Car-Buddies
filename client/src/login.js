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
            <div className="flex align-center">
                <div className="login-page bg-gray-200 backdrop-filter backdrop-blur-sm md:backdrop-blur-lg">
                    <input
                        name="email"
                        type="email"
                        required
                        onChange={(e) => this.handleChange(e)}
                        className="login-input focus:ring-2 focus:ring-blue-600 bg-gray-300 md:hover:bg-blue-600"
                        placeholder="Email"
                    />

                    <input
                        name="password"
                        type="password"
                        required
                        onChange={(e) => this.handleChange(e)}
                        className="login-input focus:ring-2 focus:ring-blue-600 bg-gray-300 md:hover:bg-blue-600"
                        placeholder="Password"
                    />
                    <button
                        className="md:hover:bg-blue-600 bg-white rounded-full mt-2 p-2 w-40"
                        onClick={(e) => this.login(e)}
                    >
                        login
                    </button>
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
                {this.state.error && (
                    <div className="login-error">
                        Oops! Something went wrong.! Please try again !
                    </div>
                )}
            </div>
        );
    }
}
