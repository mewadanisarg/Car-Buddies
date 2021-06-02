import React from "react";
import axios from "./axios";
import FriendButton from "./friends-btn";
import { socket } from "./socket";
import { Link } from "react-router-dom";
import Private from "./privatechat";
export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        // Private Chat on others Profile Page..! 
        socket.emit("get ten recent private messages", {
            id: id,
        });
        //----------------------------------------------//
        console.log("OtherProfile is Mounted..! Wohoo");
        console.log("id: ", id);
        console.log("this.props in OtherProfile: ", this.props);
        try {
            const { data } = await axios.get(`/other-user/${id}`);
            console.log("Data from OtherProfile Get req:", data);
            this.setState({
                first: data.first_name,
                last: data.last_name,
                imgUrl: data.img_url,
                bio: data.bio,
            });
            console.log("this.state:", this.state);
        } catch (error) {
            console.log("Error is ComponentDidMount of OtherProfile:", error);
            this.props.history.push("/");
        }
    }
    render() {
        console.log("Render Method OtherProfile: ", this.state);
        return (
            <div>
                {this.state && (
                    <>
                        <h3>Hi, {`${this.state.fisrt} ${this.state.last}`}</h3>
                        <img
                            src={this.state.imgUrl}
                            alt={`${this.state.first} ${this.state.last}`}
                        />
                        <h4> {this.state.bio} </h4>
                    </>
                )}
                {/*<Link to={"/find/users"}>Search users</Link>*/}
                <FriendButton id={this.props.match.params.id} />
                
            </div>
        );
    }
}
