import axios from "./axios";

export default function DeleteAccount(props) {
    const handleDeleteAccount = async () => {
        try {
            await axios.post("/delete-account");
            location.replace("/welcome");
        } catch (error) {
            console.log(
                "Error in handleDeleteAccount in DeleteAccount: ",
                error
            );
        }
    };
    return (
        <>
            <div className="flex flex-col justify-center items-center m-3">
                <img
                    className="deleteprofile-img m-2"
                    src={props.imgUrl || "/public/defaultprofilepic.jpeg"}
                    alt={`${props.first} ${props.last}`}
                />
                <h3>
                    {props.first} {props.last}
                </h3>
            </div>
            <div className="flex flex-col justify-center items-center z-20 bg-gray-300 md:w-4/5 lg:w-2/5 h-2/5 px-6 pt-8 pb-6 shadow-lg rounded-lg">
                <h1 className="text-center text-black mb-6 text-xl">
                    You are our valued Member, are you sure you want to delete
                    account ?
                </h1>
                <button
                    onClick={handleDeleteAccount}
                    className="active:outline-none bg-purple-200 font-bold rounded-full w-3/5 mt-6 p-2 duration-200 hover:bg-purple-300 hover:text-gray-700"
                >
                    Yes
                </button>
            </div>
        </>
    );
}
