import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        console.log("Uploader just mounted!");
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    submitFile(e) {
        e.preventDefault(); // preventDefault is going to stop my page being reloading..!
        // console.log("Submit File is running");

        // We'are going to use an API called FormData to send the file to server
        // FormData is only for files
        var formData = new FormData(); // we are var it with defining bcoz it is from browser
        formData.append("file", this.file);
        //FormData always logs an empty object. That does not mean the appends didnt work
        // console.log("formData:", formData);

        // Next step : send this off to server
        axios
            .post("/upload", formData)
            .then((response) => {
                // console.log("response received from server!!");
                this.images.unshift(response.data);
            })
            .catch((error) => {
                console.log(("error in POST /upload routes:", error));
            });
    }
}
