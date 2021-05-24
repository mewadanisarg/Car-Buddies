import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login.js";
import PasswordReset from "./password-reset";

export default function Welcome() {
    return (
        <div
            id="welcome"
            className="welcome-container flex flex-direction-column justify-content-center align-items"
        >
            <h1 className="welcome_message ">-- Chit Chat Chai💬 --</h1>
            <img
                className="justify-content align-items"
                src="Chit Chat Chai.png"
            />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/password/reset" component={PasswordReset} />
                </div>
            </HashRouter>
        </div>
    );
}
