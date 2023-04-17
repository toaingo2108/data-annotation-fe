import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import authClient from "../clients/authClient";
import Header from "./Header";
import { Container } from "@mui/material";

export default function DefaultLayout() {
  const { token, setUser } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    authClient.getMe().then(({ data: { data } }) => {
      setUser(data);
    });
  }, []);

  return (
    <div className="flex flex-col">
      <Header />
      <Container className="mt-4">
        <Outlet />
      </Container>
    </div>
  );
}
