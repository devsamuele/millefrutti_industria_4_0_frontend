import ReactDOM from "react-dom/client";
import "./index.css";
// import './i18n';
import App from "./App";
import store from "./store/index";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Websocket from "./components/ui/websocket/websocket";
import ThemeProvider from "./components/ui/themeProvider/ThemeProvider";
import { theme } from "tailwindcss/defaultConfig";

let breakpoints = {};
for (const bk in theme.screens) {
    breakpoints[bk] = +theme.screens[bk].slice(0, -2);
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Websocket>
                <ThemeProvider breakpoints={breakpoints}>
                    <App />
                </ThemeProvider>
            </Websocket>
        </BrowserRouter>
    </Provider>
);
