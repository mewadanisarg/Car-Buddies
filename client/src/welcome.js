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
            <img src="/Car Buddies.png" className="welcome-message" />
            <img
                className="justify-content align-items"
                src="/carbuddies.png"
            />
            <p>Where car connects people👫👩🏻‍🤝‍🧑🏻...</p>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route exact path="/login" component={Login} />
                    <Route
                        exact
                        path="/password/reset"
                        component={PasswordReset}
                    />
                </div>
            </HashRouter>
        </div>
    );
}
