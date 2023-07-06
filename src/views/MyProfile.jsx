import {
  Avatar,
  Box,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import { LoadingButton } from "@mui/lab";
import authClient from "../clients/authClient";
import { enqueueSnackbar } from "notistack";

export default function MyProfile() {
  const { user } = useStateContext();
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();

  const [loading, setLoading] = useState(false);

  const handleResetPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      oldPassword: oldPasswordRef.current.value,
      newPassword: newPasswordRef.current.value,
    };

    authClient
      .resetPassword(payload)
      .then(() => {
        enqueueSnackbar({
          message: "Updated successfully!",
          variant: "success",
        });
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
        setLoading(false);
      });
  };

  return (
    <Grid container>
      <Grid item xs={4} container direction="column">
        <Avatar className="!w-60 !h-60" />
        <Typography
          variant="h5"
          className="!mt-3 !font-semibold"
        >
          {user.name}
        </Typography>
        <Typography variant="h6">{user.email}</Typography>
      </Grid>
      <Grid item>
        <Box
          component="form"
          onSubmit={handleResetPassword}
        >
          <TextField
            inputRef={oldPasswordRef}
            margin="normal"
            required
            fullWidth
            label="Old Password"
            type="password"
            autoComplete="current-password"
          />
          <TextField
            inputRef={newPasswordRef}
            margin="normal"
            required
            fullWidth
            label="New Password"
            type="password"
            autoComplete="new-password"
          />
          <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
            className="!mt-6"
          >
            Update
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
  );
}
