export default function ProfilePic({ first, last, imgUrl, toggleUploader }) {
    
    return (
        <div className="flex flex-direction-column justify-content-center align-items">
            <h2>Hello this my profilepic component</h2>
            <img
                className="profile-photo" 
                alt={`${first} ${last}`}
                onClick={toggleUploader}
                src={imgUrl}
            ></img>
        </div>
    );
}
