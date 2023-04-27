import React, { useEffect, useState } from "react";
import projectClient from "../../clients/projectClient";
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, Edit, FilterAltRounded, Info } from "@mui/icons-material";
import { useStateContext } from "../../context/ContextProvider";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { rolesCode } from "../../utils/roles";
import projectTypeClient from "../../clients/projectTypeClient";
import { enqueueSnackbar } from "notistack";
import CustomNoRows from "../../components/CustomNoRows";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const navigate = useNavigate();
  const { user, setLoading } = useStateContext();
  const [activeChip, setActiveChip] = useState(-1);

  useEffect(() => {
    handleFilterProjectByType(activeChip);
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
      .catch((err) => {
        enqueueSnackbar({
          message: err.response.data.error || err.response.data.message,
          variant: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFilterProjectByType = (id) => {
    if (!id || id === -1) {
      collectData({});
    } else {
      collectData({
        projectTypeId: id,
      });
    }
    setActiveChip(id ? id : -1);
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

      <div className="flex flex-row items-center gap-2 mb-4 overflow-auto">
        <Chip
          key="icon-filter"
          label={<FilterAltRounded />}
          variant="filled"
          color="primary"
        />
        <Chip
          key="type-all"
          label="All"
          variant={activeChip === -1 ? "filled" : "outlined"}
          onClick={() => handleFilterProjectByType()}
        />
        {projectTypes.map((type) => (
          <Chip
            key={type.id}
            label={type.name}
            variant={activeChip === type.id ? "filled" : "outlined"}
            onClick={() => handleFilterProjectByType(type.id)}
          />
        ))}
      </div>

      {!!projects?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
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
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <div className="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    {p.name}
                  </div>
                  <div
                    className="
                    text-neutral-700 
                    font-light
                    h-20
                    overflow-auto
                    py-2 
                    whitespace-pre-wrap
                  "
                  >
                    {p.description}
                  </div>
                </div>
                <div className="col-span-1">
                  <Avatar variant="rounded" className="!w-16 !h-16">
                    {p.name[0].toUpperCase()}
                  </Avatar>
                </div>
              </div>
              <hr className="my-2" />
              <div className="flex flex-row items-center gap-1">
                <Tooltip placement="bottom" title="Info project">
                  <IconButton
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/projects/detail/" + p.id)}
                  >
                    <Info color="primary" />
                  </IconButton>
                </Tooltip>
                {[rolesCode.MANAGER].includes(user.role?.toUpperCase()) && (
                  <Tooltip placement="bottom" title="Edit Project ">
                    <IconButton
                      variant="outlined"
                      size="small"
                      onClick={() => navigate("/projects/edit/" + p.id)}
                    >
                      <Edit color="default" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-row justify-center col-start-auto">
          <CustomNoRows />
        </div>
      )}
    </div>
  );
}
