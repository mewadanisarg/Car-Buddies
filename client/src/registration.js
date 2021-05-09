import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }
    submit(event) {
        console.log("Submit button was clicked and it is working good..!");
        event.preventDefault();
        axios
            .post("/registeration", {
                first: this.state.first,
                last: this.state.last,
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
                console.log("Error in AXIOS POST /registeration route:", error);
                this.setState({
                    error: "Something ent wrong, Please try again.!",
                });
            });
    }

    render() {
        return (
            <form className="regitration-form">
                <div>
                    <h1>Welcome</h1>
                    {this.state.error && (
                        <div className="error">
                            Oops! Somwthing went wrong.! Please try again
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
                        name="pass"
                        type="password"
                        required
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={() => this.submit}>submit</button>
                    <div>
                        <span>Already a member?</span>
                        <a className="login-route" href="#">
                            Login
                        </a>
                    </div>
                </div>
            </form>
        );
    }
}
