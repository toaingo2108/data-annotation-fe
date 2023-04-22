import React, { useEffect, useState } from "react";
import projectClient from "../../clients/projectClient";
import {
  Button,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, Info } from "@mui/icons-material";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { rolesCode } from "../../utils/roles";
import projectTypeClient from "../../clients/projectTypeClient";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const navigate = useNavigate();
  const { user, setLoading } = useStateContext();

  useEffect(() => {
    collectData({});
  }, []);

  const collectData = (queryProject) => {
    setLoading(true);
    Promise.all([
      projectClient.getAllProjects(queryProject),
      projectTypeClient.getAll(),
    ])
      .then((values) => {
        setProjects(values[0].data.project);
        setProjectTypes(values[1].data.projectTypes);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFilterProjectByType = (id) => {
    if (!id) {
      collectData({});
    } else {
      collectData({
        projectTypeId: id,
      });
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-baseline">
        <Typography variant="h3">Projects</Typography>
        {[rolesCode.MANAGER].includes(user.role?.toUpperCase()) && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/projects/new")}
          >
            Create Project
          </Button>
        )}
      </div>
      <hr className="my-4" />

      <div className="flex flex-row gap-2 mb-4">
        <Chip
          key="type-all"
          label="All"
          variant="outlined"
          onClick={() => handleFilterProjectByType()}
        />
        {projectTypes.map((type) => (
          <Chip
            key={type.id}
            label={type.name}
            variant="outlined"
            onClick={() => handleFilterProjectByType(type.id)}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-center">
        {projects?.map((p) => (
          <div
            key={p.id}
            className="
              shadow-md 
              hover:shadow-lg 
              transition 
              rounded-md 
              px-4 
              py-3 
              cursor-pointer
              overflow-hidden
            "
          >
            <div className="text-lg whitespace-nowrap">{p.name}</div>
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
                  onClick={() => navigate("/projects/detail/" + p.id)}
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
