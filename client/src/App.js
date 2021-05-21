import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Logo from "./logo";
import Uploader from "./Uploader";
import ProfilePic from "./profilepic";
import axios from "./axios";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import FindPeople from "./find-people";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: false,
            uploaderIsVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);

        this.updateProfilephoto = this.updateProfilephoto.bind(this);
        this.setbio = this.setbio.bind(this);
    }
    componentDidMount() {
        //console.log("App Just Mounted..! ");
        axios
            .get("/user")
            .then((response) => {
                console.log("user data app mounted:", response);
                this.setState(
                    {
                        userId: response.data.userId,
                        first: response.data.first_name,
                        last: response.data.last_name,
                        imgUrl: response.data.img_url,
                        bio: response.data.bio,
                    },
                    // () =>
                    //     console.log(
                    //         "this.state in app after adding info: ",
                    //         this.state
                    //     )
                );
            })
            .catch((error) => console.log("error: ", error));
    }

    toggleUploader() {
        console.log("ToggleUploader is working.!");
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
    setbio(newbio) {
        this.setState({
            bio: newbio,
        });
    }

    render() {
        return (
            <div>
                <header>
                    <Logo />
                </header>
                <div className="main-app-container">
                    <ProfilePic
                        userId={this.state.userId}
                        first={this.state.first}
                        last={this.state.last}
                        imgUrl={this.state.imgUrl || "/default-user.png"}
                        toggleUploader={this.toggleUploader}
                    />
                    {
                        <BrowserRouter>
                            <div className="app-profile-container">
                                <Route
                                    exact
                                    path="/"
                                    render={() => (
                                        <Profile
                                            userId={this.state.userId}
                                            first={this.state.first}
                                            last={this.state.last}
                                            imgUrl={
                                                this.state.imgUrl ||
                                                "/default-user.png"
                                            }
                                            onClick={this.showUploader}
                                            bio={this.state.bio}
                                            setbio={this.setbio}
                                        />
                                    )}
                                />
                                <Route
                                    path="/user/:id"
                                    component={OtherProfile}
                                />
                                <Route
                                    path="/find/users"
                                    component={FindPeople}
                                />
                            </div>
                        </BrowserRouter>
                    }
                    {/*<Profile
                        userId={this.state.userId}
                        first={this.state.first}
                        last={this.state.last}
                        bio={this.state.bio}
                        setbio={this.setbio}
                        imgUrl={this.state.imgUrl || "/default-user.png"}
                    />*/}
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
