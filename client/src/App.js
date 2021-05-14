import React from "react";
import Logo from "./logo";
import Uploader from "./Uploader";
import ProfilePic from "./profilepic";
import axios from "./axios";
import Profile from "./profile";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        // this.componentDidMount = this.componentDidMount.bind(this);
        this.updateProfilephoto = this.updateProfilephoto.bind(this);
    }
    componentDidMount() {
        console.log("App Just Mounted..! ");
        axios
            .get("/user")
            .then((response) => {
                console.log("data=", response);
                this.setState({
                    userId: response.data.userId,
                    first: response.data.first_name,
                    last: response.data.last_name,
                    imgUrl: response.data.img_url,
                });
            })
            .catch((error) => console.log("error: ", error));
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }
    updateProfilephoto(imgUrl) {
        console.log("I'm running in App");

        this.setState({
            imgUrl,
        });
        this.toggleUploader();
    }

    render() {
        return (
            <div>
                <header>
                    <Logo />
                </header>
                <div className="main-container flex flex-direction-column justify-content-center align-items">
                    <h1>app component</h1>
                    <Profile
                        userId={this.state.userId}
                        first={this.state.first}
                        last={this.state.last}
                        imgUrl={this.state.imgUrl || "/default-user.png"}
                    />
                    <ProfilePic
                        userId={this.state.userId}
                        first={this.state.first}
                        last={this.state.last}
                        imgUrl={this.state.imgUrl || "/default-user.png"}
                        toggleUploader={this.toggleUploader}
                    />
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            updateProfilephoto={this.updateProfilephoto}
                            toggleUploader={this.toggleUploader}
                        />
                    )}
                </div>
            </div>
        );
    }
}
