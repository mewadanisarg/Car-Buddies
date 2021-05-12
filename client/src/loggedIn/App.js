import React from "react";import Logo from "./logo";
import Uploader from "./uploader";
import ProfilePic from "./profile-pic";
import React from "react";
import axios from "axios";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        console.log("App Just Mounted..! ");
    }

    render() {
        return (
            <React.Fragment>
                <header>
                    <h1>Hello I am App..!</h1>
                </header>
            </React.Fragment>
        );
    }
}
