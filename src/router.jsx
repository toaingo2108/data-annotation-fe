import { Navigate, createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import NotFound from "./views/NotFound";
import Users from "./views/Users";
import Login from "./views/Login";
import Projects from "./views/Projects";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/users" />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/*",
    element: <NotFound />,
  },
]);

export default router;
