import { Component } from "react";
import axios from "./axios";

export default class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = { images: [] };
    }
    componentDidMount() {
        // console.log("Gallery Component just mounted..!", this.props);
        axios
            .get("/gallery.json")
            .then((response) => {
                console.log("response.data:", response.data);
                this.setState({
                    images: response.data.images,
                });
            })
            .catch((error) => {
                console.log(
                    "error in GET req from /image componentDidMount",
                    error
                );
            });
    }
    handleChange({ target }) {
        console.log("Handle Changed", target);
        this.setState({
            [target.name]: target.files[0],
        });
    }
    submitFile(e) {
        // console.log("Upload submit was clicked..! Woho");
        e.preventDefault();
        console.log("This.state.file: ", this.state);
        var formData = new FormData();

        formData.append("file", this.state.file);
        axios
            .post("/gallery", formData)
            .then((response) => {
                // console.log("response received from server!!");
                console.log("response.data:", response.data);
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
                <h1>Hello, I am Gallery Compent..! </h1>
                <div className="galleryphoto-container">
                    <input
                        className="bg-gray-200 font-bold duration-100 hover:bg-gray-300 hover:text-gray-700"
                        type="file"
                        name="file"
                        onChange={(e) => this.handleChange(e)}
                        multiple
                    ></input>
                    <div>
                        <button
                            type="button"
                            className="
                            flex align-center

                            active:outline-none bg-gray-200 font-bold rounded-full w-24 mt-6 p-2 duration-200 hover:bg-gray-300 hover:text-gray-700"
                            onClick={(e) => this.submitFile(e)}
                        >
                            Upload Image
                        </button>
                    </div>
                    <div className="gallery-img">
                        {this.state.images.map((image) => {
                            console.log("image:", image);
                            return (
                                <>
                                    <img
                                        className="car-img"
                                        key={image.id}
                                        src={image.url}
                                    />
                                </>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
}
