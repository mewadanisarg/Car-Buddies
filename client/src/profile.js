// App -> Profile -> BioEditor
import ProfilePic from "./profilepic";
// import BioEditor from "./Bio-Editor";

export default function Profile({ first, last, imgUrl }) {
    console.log("props in Profile:", first, last, imgUrl);
    return (
        <div>
            <h1>This is my Profile Component </h1>
            <ProfilePic
                className="large-profilephoto"
                first={this.first}
                last={this.last}
                imgUrl={this.imgUrl}
            />
        </div>
    );
}
