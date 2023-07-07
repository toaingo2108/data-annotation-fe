import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { rolesUser } from "../utils/roles";
import userClient from "../clients/userClient";
import { enqueueSnackbar } from "notistack";

export default function UserForm() {
  const initUser = {
    name: "",
    email: "",
    password: "",
    role: "",
  };
  const [user, setUser] = useState(initUser);

  const handleChangeUser = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    userClient
      .storeUser(user)
      .then((res) => {
        setUser({ ...user, ...initUser });
        enqueueSnackbar("Created User Succeedfully!", {
          variant: "success",
        });
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.message, {
          variant: "error",
        });
      });
  };

  return (
    <div>
      <Typography variant="h4">New User</Typography>
      <Box
        component="form"
        className="mt-4"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col">
          <TextField
            value={user.name}
            name="name"
            label="Name"
            autoFocus
            size="small"
            margin="normal"
            required
            onChange={handleChangeUser}
          />
          <TextField
            value={user.email}
            name="email"
            label="Email"
            type="email"
            size="small"
            margin="normal"
            required
            onChange={handleChangeUser}
          />
          <TextField
            value={user.password}
            name="password"
            label="Password"
            type="password"
            size="small"
            margin="normal"
            required
            onChange={handleChangeUser}
          />
          <FormControl
            fullWidth
            margin="normal"
            size="small"
          >
            <InputLabel id="role-user-select-label">
              Role
            </InputLabel>
            <Select
              labelId="role-user-select-label"
              value={user.role}
              label="Role"
              name="role"
              size="small"
              required
              onChange={handleChangeUser}
            >
              {rolesUser.map((role) => (
                <MenuItem key={role.name} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            className="!mt-6"
          >
            Create
          </Button>
        </div>
      </Box>
    </div>
  );
}
