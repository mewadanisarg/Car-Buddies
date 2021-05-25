import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./App.js";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducer";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { io } from "socket.io-client";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

const socket = io();

socket.on("welcome", function (data) {
    console.log(data);
    socket.emit("thanks", {
        message: "Hello, How are you..! Great to be here..! ",
    });
});

if (location.pathname == "/welcome") {
    ReactDOM.render(<Welcome />, document.querySelector("main"));
} else {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.querySelector("main")
    );
}
