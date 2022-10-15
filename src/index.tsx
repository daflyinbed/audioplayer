import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { pink } from "@material-ui/core/colors";
import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
let data = JSON.parse(document.getElementById("data")?.innerHTML!!);
let notification = [];
try {
  notification = JSON.parse(
    document.getElementById("notification")?.innerHTML!!
  );
} catch (err) {
  console.error(err);
}
const theme = createMuiTheme({
  palette: {
    secondary: { main: pink[300] },
  },
});
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <App
          data={data}
          notification={notification}
        />
      </RecoilRoot>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
