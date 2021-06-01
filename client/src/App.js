import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Uploader from "./Uploader";
import ProfilePic from "./profilepic";
import axios from "./axios";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import FindPeople from "./find-people";
import Friends from "./friends";
import Chat from "./chat";
// import { Link } from "react-router-dom";
import Menu from "./sidebar";
import DeleteAccount from "./deleteaccount";

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
                // console.log("user data app mounted:", response);
                this.setState(
                    {
                        userId: response.data.userId,
                        first: response.data.first_name,
                        last: response.data.last_name,
                        imgUrl: response.data.img_url,
                        bio: response.data.bio,
                    }
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
            <div className="app-container">
                <BrowserRouter>
                    <div>
                        <Menu></Menu>
                        {/* <Link to="/">
                            <img
                                src="carbuddies.png"
                                className="chai-logo"
                            ></img>
                        </Link>
                        <Link to="/find/users" className="find-nav">
                            Find People
                        </Link>
                        <Link to="/friends" className="find-nav">
                            Friends-List
                        </Link>
                        <Link to="/chat">Message</Link>
                        <a href="/logout" className="logout">
                            Logout
                        </a> */}

                        <ProfilePic
                            userId={this.state.userId}
                            first={this.state.first}
                            last={this.state.last}
                            imgUrl={this.state.imgUrl || "/default-user.png"}
                            toggleUploader={this.toggleUploader}
                        />
                    </div>

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
                                        this.state.imgUrl || "/default-user.png"
                                    }
                                    onClick={this.showUploader}
                                    bio={this.state.bio}
                                    setbio={this.setbio}
                                    toggleUploader={this.toggleUploader}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/find/users" component={FindPeople} />
                        <Route path="/friends" component={Friends} />
                        <Route path="/chat" component={Chat} />
                        <Route
                            path="/delete-account"
                            render={() => (
                                <DeleteAccount
                                    first={this.state.first}
                                    last={this.state.last}
                                    imgUrl={
                                        this.state.imgUrl || "/default-user.png"
                                    }
                                />
                            )}
                        />
                    </div>
                </BrowserRouter>

                {this.state.uploaderIsVisible && (
                    <Uploader
                        updateProfilephoto={this.updateProfilephoto}
                        toggleUploader={this.toggleUploader}
                    />
                )}
            </div>
        );
    }
}
