import {
  Avatar,
  Dialog,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { stringAvatar, stringToColor } from "../utils";
import {
  AdminPanelSettingsRounded,
  PersonAddAltRounded,
  PersonRounded,
} from "@mui/icons-material";
import projectClient from "../clients/projectClient";
import Transition from "./Transition";
import { useStateContext } from "../context/ContextProvider";
import { rolesCode } from "../utils/roles";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import CustomNoRows from "./CustomNoRows";

export default function AssignedUsers({
  projectId,
  assignedUsers,
}) {
  console.log(assignedUsers);
  const { setLoading } = useStateContext();
  const [unassignedUsers, setUnassignedUsers] = useState(
    []
  );
  const [usersAssigned, setUsersAssigned] =
    useState(assignedUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleOpenAssignUser = useCallback(
    (projectId) => {
      setLoading(true);
      projectClient
        .getUnassingedUsers({
          id: projectId,
        })
        .then(({ data }) => {
          setUnassignedUsers(data.unassignedUsers);
          setOpenDialog(true);
        })
        .finally(() => setLoading(false));
    },
    [projectId]
  );

  const handleClose = () => {
    setOpenDialog(false);
    setTimeout(() => {
      setUnassignedUsers([]);
    }, 300);
  };

  console.log(unassignedUsers);

  const handleAssignUser = (userId, index) => {
    console.log(userId);
    projectClient
      .assignUserToProject({
        id: projectId,
        userIds: [userId],
      })
      .then(() => {
        enqueueSnackbar({
          message: "Updated successfully!",
          variant: "success",
        });
        usersAssigned.push(unassignedUsers[index]);
      })
      .catch((err) => {
        enqueueSnackbar({
          message:
            err.response.data.error ||
            err.response.data.message,
          variant: "error",
        });
      })
      .finally(() => {
        handleClose();
      });
  };

  return (
    <div className="flex flex-row gap-2">
      {assignedUsers?.map((user) => (
        <Tooltip
          key={user.id}
          title={
            <div className="flex flex-col">
              <span>{user.name}</span>
              <span>{user.email}</span>
            </div>
          }
        >
          <Avatar
            sx={{
              width: 30,
              height: 30,
              fontSize: 12,
              bgcolor: stringToColor(user.name),
            }}
          >
            {stringAvatar(user.name).children}
          </Avatar>
        </Tooltip>
      ))}
      <Tooltip key="add" title={"Add user"}>
        <IconButton
          onClick={() => handleOpenAssignUser(projectId)}
          sx={{ width: 30, height: 30, fontSize: 16 }}
        >
          <PersonAddAltRounded />
        </IconButton>
      </Tooltip>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <List sx={{ width: 320 }}>
          {unassignedUsers.length ? (
            unassignedUsers.map((user, index) => (
              <ListItemButton
                key={user.id}
                onClick={() =>
                  handleAssignUser(user.id, index)
                }
              >
                <ListItemAvatar>
                  <Avatar {...stringAvatar(user.name)}>
                    <PersonRounded />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={user.email}
                />
                {user.role.toUpperCase() ===
                  rolesCode.MANAGER && (
                  <AdminPanelSettingsRounded />
                )}
              </ListItemButton>
            ))
          ) : (
            <CustomNoRows />
          )}
        </List>
      </Dialog>
    </div>
  );
}
