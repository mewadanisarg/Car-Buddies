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
                carmaker: this.state.carmaker,
                modalno: this.state.modalno,
                regyear: this.state.regyear,
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
            <div className="registration">
                {this.state.error && (
                    <div className="error">
                        Oops! Somwthing went wrong.! Please try it again
                    </div>
                )}

                <input
                    name="first"
                    required
                    onChange={(e) => this.handleChange(e)}
                    placeholder="First Name"
                    className="registration-input focus:ring-2 focus:ring-blue-500 bg-gray-300 md:hover:bg-blue-500"
                />

                <input
                    name="last"
                    required
                    onChange={(e) => this.handleChange(e)}
                    placeholder="Last Name"
                    className="registration-input focus:ring-2 focus:ring-blue-500 bg-gray-300 md:hover:bg-blue-500"
                />

                <input
                    name="email"
                    type="email"
                    required
                    onChange={(e) => this.handleChange(e)}
                    placeholder="Email"
                    className="registration-input focus:ring-2 focus:ring-blue-500 bg-gray-300 md:hover:bg-blue-500"
                />
                <input
                    name="carmaker"
                    required
                    onChange={(e) => this.handleChange(e)}
                    placeholder="Car Company"
                    className="registration-input focus:ring-2 focus:ring-blue-500 bg-gray-300 md:hover:bg-blue-500"
                />
                <input
                    name="modalno"
                    required
                    onChange={(e) => this.handleChange(e)}
                    placeholder="Model"
                    className="registration-input focus:ring-2 focus:ring-blue-500 bg-gray-300 md:hover:bg-blue-500"
                />
                <input
                    name="regyear"
                    required
                    onChange={(e) => this.handleChange(e)}
                    placeholder="Purchased Year"
                    className="registration-input focus:ring-2 focus:ring-blue-500 bg-gray-300 md:hover:bg-blue-500"
                />

                <input
                    name="password"
                    type="password"
                    required
                    onChange={(e) => this.handleChange(e)}
                    placeholder="Password"
                    className="registration-input focus:ring-2 focus:ring-blue-500 bg-gray-300 md:hover:bg-blue-500"
                />
                <button
                    className="md:hover:bg-blue-600  bg-white rounded-full mt-2 p-2 w-40"
                    onClick={(e) => this.submit(e)}
                >
                    submit
                </button>
                <div>
                    <span>Already a member?</span> <br />
                    <Link to="/login" className="login-route" href="#">
                        Login Here!
                    </Link>
                </div>
            </div>
        );
    }
}
