export default function ProfilePic({ first, last, imgUrl, toggleUploader }) {
    return (
        <div className="profilepic-container">
            <img
                className="profile-small-photo"
                alt={`${first} ${last}`}
                onClick={toggleUploader}
                src={imgUrl || "/default-user.png"}
            ></img>
        </div>
    );
}
