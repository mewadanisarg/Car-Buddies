// App -> Profile -> BioEditor
// import ProfilePic from "./profilepic";
import BioEditor from "./Bio-Editor";

export default function Profile(props) {
    //console.log("props in Profile:", props);
    return (
        <div className="profile-container flex flex-col md:flex-col justify-start aling-center">
            {/* <ProfilePic
                    className="largepic"
                    imgUrl={props.imgUrl}
                    first={props.first}
                    last={props.last}
                    toggleUploader={props.toggleUploader}
                /> */}

            <>
                <p>
                    Welcome to your profile,{" "}
                    <span className="profile-name">{props.first}</span>!
                </p>
                <div>
                    <img
                        className="profile-img"
                        src={props.imgUrl || "/public/defaultprofilepic.jpeg"}
                        alt={`${props.first} ${props.last}`}
                    />
                </div>{" "}
                <br />
                <h3>
                    {props.first} {props.last}
                </h3>
                <br />
                <h4>My Car Info:</h4>
                <BioEditor bio={props.bio} setbio={props.setbio} />{" "}
            </>
        </div>
    );
}
