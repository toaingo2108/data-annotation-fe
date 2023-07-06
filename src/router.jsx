import {
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import NotFound from "./views/NotFound";
import Users from "./views/Users";
import Login from "./views/Login";
import MyProfile from "./views/MyProfile";
import UserForm from "./views/UserForm";
import Projects from "./views/Projects/Projects";
import ProjectDetail from "./views/Projects/ProjectDetail";
import ProjectForm from "./views/Projects/ProjectForm";
import ProjectTypes from "./views/ProjectTypes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Projects />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/new",
        element: <UserForm key="Create user" />,
      },

      {
        path: "/projects/new",
        element: <ProjectForm key="create-project" />,
      },
      {
        path: "/projects/edit/:id",
        element: <ProjectForm key="update-project" />,
      },
      {
        path: "/projects/detail/:id",
        element: <ProjectDetail />,
      },
      {
        path: "/project-types",
        element: <ProjectTypes />,
      },
      {
        path: "/my-profile",
        element: <MyProfile />,
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
    element: <NotFound>404 NOT FOUND</NotFound>,
  },
]);

export default router;
