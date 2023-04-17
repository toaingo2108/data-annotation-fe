import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ContextProvider } from "./context/ContextProvider";
import { SnackbarProvider } from "notistack";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SnackbarProvider autoHideDuration={2000} >
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </SnackbarProvider>
  </React.StrictMode>
);
