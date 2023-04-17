import React, { Fragment, useMemo, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import authClient from "../clients/authClient";
import {
  AppBar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  Inbox,
  Mail,
  Menu as MenuIcon,
  Person,
} from "@mui/icons-material";
import { rolesCode, rolesUser } from "../utils/roles";
import { useNavigate } from "react-router-dom";

const menu = [
  {
    title: "Projects",
    url: "/projects",
    icon: <Person />,
  },
  {
    title: "Users",
    url: "/users",
    icon: <Person />,
  },
];

export default function Header() {
  // hooks
  const navigate = useNavigate();

  // states
  const { user, setUser, setToken } = useStateContext();
  const [anchorEl, setAnchorEl] = useState();
  const [openMenuDrawer, setOpenMenuDrawer] = useState(false);

  const findUserRole = useMemo(
    () => rolesUser.find((role) => role.name === user.role?.toUpperCase()),
    [user]
  );

  // methods
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleMenuDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpenMenuDrawer(open);
  };

  const listMenuDrawer = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleMenuDrawer(false)}
      onKeyDown={toggleMenuDrawer(false)}
    >
      <List>
        {menu.map((item, index) => (
          <ListItem
            key={item.title}
            disablePadding
            onClick={() => navigate(item.url)}
          >
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* <Divider /> */}
      {/* <List>
        {menu
          .filter((item) => item.role.includes(rolesCode.MANAGER))
          .map((item, index) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
      </List> */}
    </Box>
  );

  const onLogout = () => {
    authClient.logout().then(() => {
      setUser({});
      setToken(null);
    });
  };

  // UI
  return (
    <Fragment>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleMenuDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Photos
          </Typography>
          {findUserRole && (
            <Chip color={findUserRole?.colorChip} label={findUserRole?.name} />
          )}
          <div className="px-2">{user.name}</div>
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
              <MenuItem className="!text-red-600" onClick={() => onLogout()}>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={openMenuDrawer}
        onClose={toggleMenuDrawer(false)}
      >
        {listMenuDrawer()}
      </Drawer>
    </Fragment>
  );
}
