import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        // console.log("Uploader just mounted!", this.props);
    }

    handleChange({ target }) {
        console.log("Handle Changed", target);
        this.setState({
            [target.name]: target.files[0],
        });
    }
    submitFile(e) {
        console.log("Upload submit was clicked..! Woho");
        e.preventDefault();
        console.log("This.state.file: ", this.state.file);
        var formData = new FormData();
        
        formData.append("file", this.state.file);
        axios
            .post("/upload", formData)
            .then((response) => {
                console.log("response received from server!!");
                console.log("response.data:", response.data);
                this.props.updateProfilephoto(response.data.imgUrl);
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
                    <div className="modal-text-container">
                        <h4>Update Profile Photo</h4>
                    </div>
                    <input
                        type="file"
                        name="file"
                        className="inputfile"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <div className="modal-btn">
                        <button
                            type="button"
                            className="btn btn-secondary pic-upload-btn"
                            onClick={(e) => this.submitFile(e)}
                        >
                            Upload
                        </button>{" "}
                        <br />
                        <button
                            type="button"
                            className="btn btn-secondary pic-upload-btn"
                            href="#"
                            onClick={this.props.toggleUploader}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </>
        );
    }
}
