import ReactDOM from "react-dom";
import Welcome from "./welcome";

let elem = (
    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.dribbble.com%2Fusers%2F406059%2Fscreenshots%2F1466728%2Fdribbble_spirit_logo.gif&f=1&nofb=1" />
);

if (location.pathname == "/welcome") {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
