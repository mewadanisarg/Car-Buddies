import React from "react";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    async componentDidMount() {
        console.log("OtherProfile is Mounted..! Wohoo");
        const { id } = this.props.match.params;
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
            <>
                <div>
                    {this.state && (
                        <p>User Idenfication {this.props.match.params.id}</p>
                    )}
                    <img
                        src={this.state.imgUrl}
                        alt={`${this.state.first} ${this.state.last}`}
                    />
                    <h4>
                        {" "}
                        {this.state.first} {this.state.last}
                        <p>{this.state.bio}</p>
                    </h4>
                </div>
            </>
        );
    }
}
