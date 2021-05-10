import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class PasswordReset extends Component {
    constructor() {
        super();
        this.state = {
            view: 1,
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    submit(e) {
        e.preventDefault();
        this.setState = {
            error: null,
        };
        if (this.state.view === 1) {
            axios
                .post("/password/reset/start", {
                    email: this.state["email"],
                })
                .then(() => {
                    this.setState({
                        view: 2,
                    });
                })
                .catch((error) => {
                    console.log(
                        "Error in Axios /password/reset/start route view === 1",
                        error
                    );
                    this.setState({
                        error: "Something went wrong. Please, try again.",
                    });
                });
        } else if (this.state.view === 2) {
            axios
                .post("/password/reset/verify", {
                    email: this.state["email"],
                    password: this.state["password"],
                    code: this.state["code"],
                })
                .then(() => {
                    this.setState({
                        view: 3,
                    });
                })
                .catch((error) => {
                    console.log(
                        "Error in Axios /password/reset/verify route view === 2",
                        error
                    );
                    this.setState({
                        error: "Something went wrong. Please, try again.",
                    });
                });
        }
    }
    determineViewToRender() {
        if (this.state.view === 1) {
            return (
                <form>
                    {this.state.error && (
                        <p className="error">
                            Oops! Something went wrong.! Please try again
                        </p>
                    )}
                    <h2>Please enter the registered email</h2>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        onChange={(e) => {
                            this.handleChange(e);
                        }}
                    />
                    <button
                        type="submit"
                        onClick={(e) => {
                            this.handleChange(e);
                        }}
                    >
                        Submit
                    </button>
                </form>
            );
        } else if (this.state.view === 2) {
            return (
                <form>
                    {this.state.error && (
                        <p className="error">
                            Oops! Something went wrong.! Please try again
                        </p>
                    )}
                    <label htmlFor="code">Verification Code</label>
                    <input
                        type="text"
                        name="code"
                        id="code"
                        required
                        onChange={(e) => {
                            this.handleChange(e);
                        }}
                    />
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        onChange={(e) => {
                            this.handleChange(e);
                        }}
                    />
                    <button
                        type="submit"
                        onClick={(e) => {
                            this.handleSubmit(e);
                        }}
                    >
                        Save
                    </button>
                </form>
            );
        } else if (this.state.view === 3) {
            return (
                <div>
                    <p>
                        <h2>You have successfully reset your password</h2>
                    </p>
                    <Link to="/login">Login</Link>
                </div>
            );
        }
    }
    render() {
        return (
            <>
                {/*calling our method to figure out which view we should render*/}
                {this.determineViewToRender}
            </>
        );
    }
}
