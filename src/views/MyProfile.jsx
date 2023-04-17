import { Avatar, Grid, Typography } from "@mui/material";
import React from "react";
import { useStateContext } from "../context/ContextProvider";

export default function MyProfile() {
  const { user } = useStateContext();
  return (
    <Grid container>
      <Grid item xs={4} container direction="column">
        <Avatar className="!w-60 !h-60" />
        <Typography variant="h5" className="!mt-3 !font-semibold">
          {user.name}
        </Typography>
        <Typography variant="h6">{user.email}</Typography>
      </Grid>
      <Grid item></Grid>
    </Grid>
  );
}
