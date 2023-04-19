import React, { useEffect, useState } from "react";
import projectClient from "../../clients/projectClient";
import {
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const { setLoading } = useStateContext();

  useEffect(() => {
    setLoading(true);
    projectClient
      .getAllProjects({})
      .then(({ data }) => {
        console.log(data.projects);
        setProjects(data.projects);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Typography variant="h3">Projects</Typography>
      <hr className="my-4" />

      <div className="flex flex-row gap-4 items-center">
        {projects.map((p) => (
          <div
            key={p.id}
            className="
              w-60 
              shadow-md 
              hover:shadow-lg 
              transition 
              rounded-md 
              px-4 
              py-3 
              cursor-pointer
            "
          >
            <div className="text-lg">{p.name}</div>
            <div
              className="
              text-neutral-700 
                font-light
              "
            >
              {p.description}
            </div>
            <hr className="my-2" />
            <div className="">
              <Tooltip placement="bottom" title="Info project">
                <IconButton
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/projects/" + p.id)}
                >
                  <Info color="primary" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
