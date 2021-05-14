// App -> Profile -> BioEditor
import ProfilePic from "./profilepic";
// import BioEditor from "./Bio-Editor";

export default function Profile(props) {
    console.log("props in Profile:", props);
    return (
        <div>
            <h1>This is my Profile Component </h1>
            <ProfilePic
                className="large-profilephoto"
                first={props.first}
                last={props.last}
                imgUrl={props.imgUrl}
            />
        </div>
    );
}
