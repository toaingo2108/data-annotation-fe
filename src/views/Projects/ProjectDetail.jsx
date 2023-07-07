import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import projectClient from "../../clients/projectClient";
import { useStateContext } from "../../context/ContextProvider";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Drawer,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { colors } from "../../utils/constants";
import { rolesCode } from "../../utils/roles";
import {
  Add,
  DeleteForeverRounded,
} from "@mui/icons-material";
import MySpeedDial from "../../components/speed-dial";
import sampleClient from "../../clients/sampleClient";
import { enqueueSnackbar } from "notistack";
import SampleDialog from "../../components/sample/SampleDialog";
import AssignedUsers from "../../components/AssignedUsers";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const { user, setLoading } = useStateContext();
  const [
    openCreateSampleDrawer,
    setOpenCreateSampleDrawer,
  ] = useState(false);
  const [openDeleteProject, setOpenDeleteProject] =
    useState(false);
  const [sampleTexts, setSampleTexts] = useState([]);
  const [loadingCreateSample, setLoadingCreateSample] =
    useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openSample, setOpenSample] = useState(false);
  const [sampleChose, setSampleChose] = useState({});
  const [projectName, setProjectName] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const actions = [
    {
      icon: <Add />,
      name: "Create Sample",
      onClick: () => setOpenCreateSampleDrawer(true),
      isShow: [rolesCode.MANAGER].includes(
        user.role?.toUpperCase()
      ),
    },
    {
      icon: (
        <DeleteForeverRounded className="text-red-600" />
      ),
      name: "Delete Project",
      onClick: () => setOpenDeleteProject(true),
      isShow: true,
    },
  ];

  useEffect(() => {
    collectData();
  }, []);

  const collectData = () => {
    setLoading(true);
    projectClient
      .getProjectById({
        id,
        withSamples: 1,
        withAssignedUsers: 1,
      })
      .then(({ data }) => {
        setProject(data.project);
        const textTitles =
          data.project.textTitles.split(",");
        setSampleTexts(
          Array.apply(
            null,
            Array(data.project.numberOfTexts)
          ).map((x, i) => ({
            title: textTitles[i] || "",
            text: "",
          }))
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeSampleTest = (index) => (e) => {
    sampleTexts[index].text = e.target.value;
    setSampleTexts([...sampleTexts]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoadingCreateSample(true);
    try {
      if (!file) {
        await sampleClient.create({
          projectId: project.id,
          sampleTexts,
        });
      } else {
        await projectClient.importFile({
          id: project.id,
          file,
        });
      }
      enqueueSnackbar({
        message: "Created Sample Successfully!",
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar({
        message:
          err.response.data.error ||
          err.response.data.message,
        variant: "error",
      });
    } finally {
      setLoadingCreateSample(false);
      setOpenCreateSampleDrawer(false);
      collectData();
      setFile(null);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setLoadingDelete(true);
    projectClient
      .deleteProject({
        id: project.id,
      })
      .then(() => {
        enqueueSnackbar({
          message: "Deleted Project Successfully!",
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
        setLoadingDelete(false);
        setOpenDeleteProject(false);
        navigate("/");
      });
  };

  const handleOpenSample = (sample) => {
    setOpenSample(true);
    setSampleChose(sample);
  };

  const handleCloseSample = () => {
    setOpenSample(false);
    setSampleChose({});
  };

  const handleUploadFile = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div>
      <div className="flex flex-col">
        <Typography
          variant="h3"
          className="overflow-hidden whitespace-nowrap text-ellipsis"
        >
          {project.name}
        </Typography>
        {user.role?.toUpperCase() === rolesCode.MANAGER && (
          <div className="mt-4">
            <AssignedUsers
              projectId={project.id}
              assignedUsers={project.assignedUsers}
            />
          </div>
        )}
      </div>
      <hr className="my-4" />
      {!!project.labelSets?.length && (
        <div className="flex flex-col gap-2">
          <div>Lable sets: </div>
          {project.labelSets?.map((item, index) => (
            <div
              key={`labelSet ${index} ${item.id}`}
              className="flex flex-row flex-wrap gap-1"
            >
              {item.labels.map((label) => (
                <Chip
                  key={`label ${label.id}`}
                  label={label.label}
                  variant={
                    item.pickOne ? "outlined" : "filled"
                  }
                />
              ))}
            </div>
          ))}
          <hr className="w-2/5" />
        </div>
      )}
      {!!project.entities?.length && (
        <React.Fragment>
          <div className="flex flex-row flex-wrap gap-2 items-center mt-4">
            <div>Entity: </div>
            {project.entities?.map((item, index) => (
              <Chip
                key={`entity ${index} ${item.id}`}
                label={item.name}
                variant="filled"
                color={colors[index % 6]}
              />
            ))}
          </div>
          <hr className="w-2/5 mt-2" />
        </React.Fragment>
      )}
      <div className="mt-8 flex flex-row flex-wrap gap-4 items-center">
        {project.samples?.map((s) => (
          <div
            key={`sample - ${s.id}`}
            onClick={() => handleOpenSample(s)}
            className="flex flex-row gap-4 px-4 py-2 items-center cursor-pointer border shadow-sm rounded-lg hover:shadow-lg transition"
          >
            <Chip
              className="!cursor-pointer"
              variant="outlined"
              label="Sample"
            />
            <div>{s.id}</div>
          </div>
        ))}
      </div>
      <div className="fixed">
        <MySpeedDial actions={actions} />
      </div>
      <Drawer anchor="right" open={openCreateSampleDrawer}>
        <Box
          component="form"
          onSubmit={onSubmit}
          className="px-10 py-6 h-full md:w-[500px]"
        >
          <div className="flex justify-between flex-col h-full">
            <div>
              <div className="text-2xl font-black mb-10 ">
                New Sample
              </div>
              <div className="max-h-[500px] md:max-h-[600px] overflow-auto">
                {sampleTexts.map((item, index) => (
                  <TextField
                    key={`sampleText ${index}`}
                    label={item.title}
                    value={item.text}
                    onChange={handleChangeSampleTest(index)}
                    fullWidth
                    required
                    rows={4}
                    multiline
                    margin="dense"
                    disabled={loadingCreateSample || !!file}
                  />
                ))}
              </div>
              <hr className="my-8" />
              <input
                type="file"
                onChange={handleUploadFile}
                accept=".csv"
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <LoadingButton
                loading={loadingCreateSample}
                variant="contained"
                type="submit"
              >
                Create
              </LoadingButton>
              <Button
                variant="outlined"
                onClick={() =>
                  setOpenCreateSampleDrawer(false)
                }
                color="error"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      </Drawer>
      <Drawer anchor="right" open={openDeleteProject}>
        <Box
          component="form"
          onSubmit={handleDelete}
          className="px-10 py-6 h-full md:w-[500px]"
        >
          <div className="flex justify-between flex-col h-full">
            <div>
              <div className="text-sm font-black mb-10 ">
                Warning: Deleting this project will
                permanently remove all associated data and
                cannot be undone. Are you sure you want to
                proceed with the deletion?
              </div>
              <div className="max-h-[500px] md:max-h-[600px] overflow-auto">
                <TextField
                  label="Project name"
                  value={projectName}
                  onChange={(e) =>
                    setProjectName(e.target.value)
                  }
                  fullWidth
                  required
                  margin="dense"
                />
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <LoadingButton
                loading={loadingDelete}
                variant="contained"
                type="submit"
                disabled={projectName !== project.name}
              >
                Delete
              </LoadingButton>
              <Button
                variant="outlined"
                onClick={() => setOpenDeleteProject(false)}
                color="error"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      </Drawer>

      {openSample && (
        <SampleDialog
          isOpen={openSample}
          project={project}
          sampleChose={sampleChose}
          onClose={() => handleCloseSample()}
        />
      )}
    </div>
  );
}
