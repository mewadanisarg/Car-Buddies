import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("Uploader just mounted!", this.props);
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }
    submitFile(e) {
        e.preventDefault();
        var formData = new FormData(); // we are var it with defining bcoz it is from browser
        formData.append("file", this.file);
        axios
            .post("/upload", formData)
            .then((response) => {
                console.log("response received from server!!");
                this.props.updateProfile(response.data);
            })
            .catch((error) => {
                console.log(("error in POST /upload routes:", error));
                this.setState({
                    error: "Something went wrong, Please try again later.",
                });
            });
    }
    render() {
        return (
            <>
                <div className="modal-container">
                    <div
                        className="modal-text-container
                    "
                    >
                        <h4>Update Profile Photo</h4>
                    </div>
                    <input
                        type="file"
                        name="file"
                        className="inputfile"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <div className="modal-btn">
                        <button onClick={(e) => this.submitFile(e)}>
                            Upload
                        </button>
                        <button href="#" onClick={this.props.toggleUploader}>
                            Cancel
                        </button>
                    </div>
                </div>
            </>
        );
    }
}
