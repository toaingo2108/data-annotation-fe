import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import authClient from "../clients/authClient";
import { useStateContext } from "../context/ContextProvider";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useStateContext();

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    setErrors(null);
    setLoading(true);
    authClient
      .login(payload)
      .then(({ data: { data } }) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status !== 500) {
          enqueueSnackbar(response.data.error || response.data.message, {
            variant: "error",
          });
        } else {
          enqueueSnackbar(err.message, {
            variant: "error",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="h-screen flex justify-center items-center animated fadeInDown">
      <Box
        component="form"
        onSubmit={onSubmit}
        className="w-96 bg-white p-9 shadow-lg"
      >
        <Typography variant="h6" align="center">
          Login into your account
        </Typography>
        {errors && (
          <div>
            {Object.keys(errors).map((key) => (
              <Alert severity="warning" key={key}>
                {errors[key][0]}
              </Alert>
            ))}
          </div>
        )}
        <TextField
          inputRef={emailRef}
          margin="normal"
          required
          fullWidth
          label="Email Address"
          type="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          inputRef={passwordRef}
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          autoComplete="current-password"
        />
        <LoadingButton
          loading={loading}
          type="submit"
          fullWidth
          variant="contained"
          className="!mt-6"
        >
          Login
        </LoadingButton>
        <Typography variant="body2" align="center" className="!mt-4">
          Not Registered?{" "}
          <Link to="/signup" className="text-blue-900">
            Create an account
          </Link>
        </Typography>
      </Box>
    </div>
  );
}
