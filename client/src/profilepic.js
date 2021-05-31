export default function ProfilePic({ first, last, imgUrl, toggleUploader }) {
    return (
        <div className="profilepic" onClick={toggleUploader}>
            <img
                className="profile-small-photo"
                alt={`${first} ${last}`}
                src={imgUrl || "/default-user.png"}
            ></img>
        </div>
    );
}
