import { Component } from "react";
import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTextArea: false,
        };
        this.handleBioChange = this.handleBioChange.bind(this);
        this.submitBio = this.submitBio.bind(this);
        this.toggleTextArea = this.toggleTextArea.bind(this);
    }
    componentDidMount() {
        //console.log("BioEditior Mounted..!");
        //console.log("BioEditior Props: ", this.props);
    }
    handleBioChange({ target }) {
        console.log("target.name: ", target.name);
        this.setState({
            [target.name]: target.value,
        });
        console.log("target.value: ", target.value);
    }
    submitBio(e) {
        console.log("Save button was clicked.. And its working Fine.! ");
        e.preventDefault(); // *! To prevent refresh of the page
        // if (!this.state.biodraft) {
        //     this.toggleTextArea();
        //     return;
        // }
        axios
            .post("/update-UserBio", {
                bio: this.state.biodraft,
            })
            .then((response) => {
                console.log(
                    "response from axios req to update BIO of the user",
                    response
                );
                const { bio } = response.data;
                this.props.setbio(bio);
                this.toggleTextArea();
                // toggle the it mode.. ie comeout of it.
                // update the bio bio vaölue
            })
            .catch((error) => {
                console.log(
                    "Error in updating the Bio, please try again!",
                    error
                );
            });
    }
    toggleTextArea() {
        this.setState({
            showTextArea: !this.state.showTextArea,
        });
    }

    render() {
        return (
            <div className="bio-draft-container">
                {/** if there is no text editor and no bio */}
                {!this.props.bio && !this.state.showTextArea && (
                    <>
                        <div>
                            <button onClick={(e) => this.toggleTextArea(e)}>
                                Add Bio
                            </button>
                        </div>
                    </>
                )}
                {/** if there is bio then user can see or Edit the bio */}
                {this.props.bio && (
                    <>
                        <div>
                            <h3>{this.props.bio}</h3>
                        </div>
                        <button onClick={(e) => this.toggleTextArea(e)}>
                            Edit Bio
                        </button>
                    </>
                )}
                {this.state.showTextArea && (
                    <>
                        <textarea
                            name="biodraft"
                            placeholder="Insert your bio here..!"
                            defaultValue={this.props.value}
                            onChange={(e) => this.handleBioChange(e)}
                        ></textarea>
                        <button onClick={(e) => this.submitBio(e)}>
                            Update
                        </button>
                        <button onClick={(e) => this.toggleTextArea(e)}>
                            Cancel
                        </button>
                    </>
                )}
            </div>
        );
    }
}
// {
//     this.state.showTextArea && (
//         <>
//             <textarea
//                 onChange={(e) => this.handleBioChange(e)}
//                 name="biodraft"
//             ></textarea>
//             <button type="submit" onClick={(e) => this.submitBio(e)}>
//                 Save Bio
//             </button>
//         </>
//     );
// }
// {
//     /** if there is no bio & text field at all.! */
// }
// {
//     !this.state.showTextArea && !this.props.bio && (
//         <div>
//             <button onClick={(e) => this.toggleTextArea(e)}>Add Bio</button>
//         </div>
//     );
// }
// {
//     /** if there is a bio and text field */
// }
// {
//     this.state.showTextArea && (
//         <div>
//             {/**<button onClick={(e) => this.submitBio(e)}>Save</button>*/}
//             <button onClick={(e) => this.toggleTextArea(e)}>Edit Bio</button>
//             <button onClick={(e) => this.toggleTextArea(e)}> Cancel </button>
//         </div>
//     );
// }
