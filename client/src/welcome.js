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
            <h1>Welcome</h1>
            <img
                className="justify-content align-items"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.dribbble.com%2Fusers%2F406059%2Fscreenshots%2F1466728%2Fdribbble_spirit_logo.gif&f=1&nofb=1"
            />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/password/reset" component={PasswordReset} />
                </div>
            </HashRouter>
            <span>
                <footer>&copy; Nisarg Mewada, Social Network 2021-22.</footer>
            </span>
        </div>
    );
}
