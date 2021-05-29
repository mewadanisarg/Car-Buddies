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
    handleChange({ target }) {
        console.log(target.name);
        console.log(target.value);
        this.setState({
            [target.name]: target.value,
        });
    }
    submit(e) {
        e.preventDefault();

        if (this.state.view === 1) {
            axios
                .post("/password/reset/start", {
                    email: this.state.email,
                })
                .then(({ data }) => {
                    console.log("data:", data);
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
                    email: this.state.email,
                    password: this.state.password,
                    code: this.state.code,
                })
                .then(({ data }) => {
                    console.log("data:", data);
                    this.setState({
                        view: 3,
                    });
                })
                .catch((error) => {
                    console.log(
                        "Error in Axios /password-reset/verify route view === 2",
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
                <div className="password-reset">
                    {this.state.error && (
                        <p className="error">
                            Oops! Something went wrong.! Please try again
                        </p>
                    )}
                    <h2>Please enter the registered email</h2>
                    <label htmlFor="email"></label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        required
                        onChange={(e) => {
                            this.handleChange(e);
                        }}
                    />
                    <button
                        type="submit"
                        onClick={(e) => {
                            this.submit(e);
                        }}
                    >
                        Submit
                    </button>
                </div>
            );
        } else if (this.state.view === 2) {
            return (
                <div className="password-reset">
                    {this.state.error && (
                        <p className="error">
                            Oops! Something went wrong.! Please try it again
                        </p>
                    )}
                    <form className="">
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
                        <label htmlFor="password"></label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            required
                            onChange={(e) => {
                                this.handleChange(e);
                            }}
                        />
                        <button
                            type="submit"
                            onClick={(e) => {
                                this.submit(e);
                            }}
                        >
                            Save
                        </button>
                    </form>
                </div>
            );
        } else if (this.state.view === 3) {
            return (
                <div className="password-reset">
                    <p>
                        <>You have successfully reset your password</>
                    </p>
                    Go to Login page
                    <Link to="/login">Login</Link>
                </div>
            );
        }
    }
    render() {
        return (
            <>
                {/*calling our method to figure out which view we should render*/}
                {this.determineViewToRender()}
                <div>
                    <Link
                        to="/login"
                        className="flex flex-direction-column align-items"
                        href="#"
                    >
                        Back to Login Page
                    </Link>
                </div>
            </>
        );
    }
}
