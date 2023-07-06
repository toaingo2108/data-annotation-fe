import React, { Fragment, useMemo, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import authClient from "../clients/authClient";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
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
  AccountCircleRounded,
  Home,
  ListRounded,
  Menu as MenuIcon,
  Person,
  Title,
  Work,
} from "@mui/icons-material";
import { rolesCode, rolesUser } from "../utils/roles";
import { useNavigate } from "react-router-dom";

const menu = [
  {
    title: "Projects",
    url: "/",
    icon: <Work />,
  },
  {
    title: "Project Types",
    url: "/project-types",
    icon: <Title />,
    forRoles: [rolesCode.MANAGER],
  },
  {
    title: "Users",
    url: "/users",
    icon: <Person />,
    forRoles: [rolesCode.MANAGER],
  },
];

export default function Header() {
  // hooks
  const navigate = useNavigate();

  // states
  const { user, setUser, setToken, loading } =
    useStateContext();
  const [anchorEl, setAnchorEl] = useState();
  const [openMenuDrawer, setOpenMenuDrawer] =
    useState(false);

  const findUserRole = useMemo(
    () =>
      rolesUser.find(
        (role) => role.name === user.role?.toUpperCase()
      ),
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
        {menu
          .filter(
            (item) =>
              !item.forRoles ||
              item.forRoles.includes(
                user.role?.toUpperCase()
              )
          )
          .map((item, index) => (
            <React.Fragment key={item.title}>
              <ListItem
                disablePadding
                onClick={() => navigate(item.url)}
              >
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
              {item.divider && <Divider />}
            </React.Fragment>
          ))}
      </List>
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
      <AppBar position="sticky">
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
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Data Annotation
          </Typography>
          {findUserRole && (
            <Chip
              color={findUserRole?.colorChip}
              label={findUserRole?.name}
            />
          )}
          <div className="px-2">{user.name}</div>
          <div>
            <Chip
              label={
                <div className="flex flex-row gap-1">
                  <ListRounded />
                  <AccountCircleRounded />
                </div>
              }
              variant="filled"
              className="!bg-white hover:!bg-neutral-200 !transition"
              onClick={handleMenu}
            />
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
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
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/my-profile");
                }}
              >
                My profile
              </MenuItem>
              <MenuItem
                className="!text-red-600"
                onClick={() => onLogout()}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <div className={loading ? "visible" : "invisible"}>
        <LinearProgress />
      </div>
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
