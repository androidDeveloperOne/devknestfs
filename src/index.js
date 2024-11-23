import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Provider } from "react-redux";
import { store } from "./Redux/Store";
import { BrowserRouter } from "react-router-dom";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
// import { BrowserRouter } from "react-router-dom";




const root = ReactDOM.createRoot(document.getElementById("root"));


if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}
root.render(


  
  // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter >
        <App />
      </BrowserRouter>
    </Provider>
    // </React.StrictMode>
);

reportWebVitals();
  