import { Component } from "react";
import axios from ".axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTextArea: true,
        };
    }
    handleBioChange(e){
        // in here , you want to keep track of the bio that the user is type.!
        // and store that value in biodeditor's stae as the "draft bio"
    }
    submitBio(){
        // 1. Make an axios POST request with new Bio (draft) that the user typed!
        // You should grab the draft bio from bioeditor's state
    }

    render() {
        return (
            <div>
                <h1>This is my BioEditor Component</h1>

                {this.state.showTextArea && (
                    <div>
                        <textarea></textarea>
                    </div>
                )}
                
            </div>
        );
    }
}
