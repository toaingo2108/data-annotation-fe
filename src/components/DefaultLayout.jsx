import React, { useLayoutEffect } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import authClient from "../clients/authClient";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";

const menu = [
  {
    href: "/dashboard",
    title: "Dashboard",
  },
  {
    href: "/users",
    title: "Users",
  },
];

export default function DefaultLayout() {
  const { user, token, setUser, setToken } = useStateContext();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();

    authClient.logout().then(() => {
      setUser({});
      setToken(null);
    });
  };

  useLayoutEffect(() => {
    // authClient.getMe().then(({ data }) => {
    //   setUser(data);
    // });
  }, []);

  return (
    <div className="flex ">
      {/* <aside className="w-60 bg-slate-600 p-4">
        {menu.map((menuItem) => (
          <Link
            key={menuItem.href}
            to={menuItem.href}
            className="block px-3 py-4 rounded-md text-white hover:bg-slate-400 transition-all"
          >
            {menuItem.title}
          </Link>
        ))}
      </aside> */}
      <AppBar position="absolute">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Photos
          </Typography>
          {true && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <div>
        <Outlet />
      </div>
    </div>
  );
}
