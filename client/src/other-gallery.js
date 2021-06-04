import { Component } from "react";
import axios from "./axios";

export default class OthersGallery extends Component {
    constructor(props) {
        super(props);
        this.state = { images: [] };
    }
    async componentDidMount() {
        // console.log("OthersUsersGallery Component just mounted..!", this.props);
        const { id } = this.props;
        // console.log("id: ", id);
        // console.log("this.props in OtherProfile: ", this.props);
        try {
            const { data } = await axios.get(`/othersUserGallery/${id}`);
            // console.log("Data from others gallery component:", data);
            this.setState({
                images: data,
            });
            // console.log("this.state:", this.state);
        } catch (error) {
            console.log(
                "error in GET req from /OthersUserGallery componentDidMount",
                error
            );
        }
    }
    render() {
        if (!this.state) {
            return null;
        }
        // console.log("This.state inside render:", this.state);
        return (
            <>
                <div className="galleryphoto-container">
                    <div className="gallery-img">
                        {this.state.images &&
                            this.state.images.map((image) => {
                                // console.log("image:", image);
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
