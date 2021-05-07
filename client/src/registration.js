import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/registeration", {
                first: this.state.first,
                email: this.state.email,
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }
    render() {
        return (
            <div>
                {this.state.error && (
                    <div className="error">
                        Oops! Somwthing went wrong.! Please try again
                    </div>
                )}
                <input name="first" onChange={(e) => this.handleChange(e)} />
                <input name="last" onChange={(e) => this.handleChange(e)} />
                <input
                    name="email"
                    type="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="pass"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={() => this.submit}>submit</button>
            </div>
        );
    }
}
