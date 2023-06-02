import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import authClient from "../clients/authClient";
import Header from "./Header";
import { Container } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import Footer from "./Footer";

export default function DefaultLayout() {
  const { token, setUser, setToken } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    authClient
      .getMe()
      .then(({ data: { data } }) => {
        setUser(data);
      })
      .catch((err) => {
        console.log(err.message);
        enqueueSnackbar(err.message, { variant: "error" });
        setToken(null);
        setUser({});
      });
  }, []);

  return (
    <div className="flex flex-col">
      <Header />
      <Container className="min-h-screen pt-6 pb-10">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}
