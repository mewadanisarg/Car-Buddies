import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./App.js";

if (location.pathname == "/welcome") {
    ReactDOM.render(<Welcome />, document.querySelector("main"));
} else {
    ReactDOM.render(<App />, document.querySelector("main"));
}
