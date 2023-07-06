import { Button, Container } from "@mui/material";
import React from "react";
import CustomNoRows from "../components/CustomNoRows";
import { useNavigate } from "react-router-dom";

export default function NotFound({ children }) {
  const navigate = useNavigate();
  return (
    <Container sx={{ height: "100vh" }}>
      <CustomNoRows
        title={
          <div className="flex flex-col justify-center">
            <div className="my-4 text-lg">
              {children ||
                "You do not have permission to access"}
            </div>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
            >
              GO BACK HOME
            </Button>
          </div>
        }
      />
    </Container>
  );
}
