// App -> Profile -> BioEditor
import ProfilePic from "./profilepic";
import BioEditor from "./Bio-Editor";

export default function Profile(props) {
    //console.log("props in Profile:", props);
    return (
        <div className="profile-container">
            <ProfilePic
                className="large-profile-photo"
                first={props.first}
                last={props.last}
                imgUrl={props.imgUrl}
            />
            <>
                <h3>
                    {props.first} {props.last}
                </h3>
                <h4>Bio</h4>
                <BioEditor bio={props.bio} setbio={props.setbio} />{" "}
            </>
        </div>
    );
}
