import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import { Add, DeleteForeverRounded } from "@mui/icons-material";
import MySpeedDial from "../../components/speed-dial";
import sampleClient from "../../clients/sampleClient";
import { enqueueSnackbar } from "notistack";
import SampleDialog from "../../components/sample/SampleDialog";
import AssignedUsers from "../../components/AssignedUsers";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const { user, setLoading } = useStateContext();
  const [openCreateSampleDrawer, setOpenCreateSampleDrawer] = useState(false);
  const [sampleTexts, setSampleTexts] = useState([]);
  const [loadingCreateSample, setLoadingCreateSample] = useState(false);
  const [openSample, setOpenSample] = useState(false);
  const [sampleChose, setSampleChose] = useState({});

  const actions = [
    {
      icon: <Add />,
      name: "Create Sample",
      onClick: () => setOpenCreateSampleDrawer(true),
      isShow: [rolesCode.MANAGER].includes(user.role?.toUpperCase()),
    },
    {
      icon: <DeleteForeverRounded className="text-red-600" />,
      name: "Delete Project",
      onClick: () => {},
      isShow: true,
    },
  ];

  useEffect(() => {
    collectData();
  }, []);

  const collectData = () => {
    setLoading(true);
    projectClient
      .getProjectById({ id, withSamples: 1, withAssignedUsers: 1 })
      .then(({ data }) => {
        setProject(data.project);
        const textTitles = data.project.textTitles.split(",");
        setSampleTexts(
          Array.apply(null, Array(data.project.numberOfTexts)).map((x, i) => ({
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
  console.log(project);

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      projectId: project.id,
      sampleTexts,
    };
    setLoadingCreateSample(true);
    sampleClient
      .create(payload)
      .then((data) => {
        enqueueSnackbar({
          message: "Created Sample Successfully!",
          variant: "success",
        });
      })
      .catch((err) => {
        enqueueSnackbar({
          message: err.response.data.error || err.response.data.message,
          variant: "error",
        });
      })
      .finally(() => {
        setLoadingCreateSample(false);
        setOpenCreateSampleDrawer(false);
        collectData();
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

  return (
    <div>
      <div className="flex flex-col">
        <Typography
          variant="h3"
          className="overflow-hidden whitespace-nowrap text-ellipsis"
        >
          {project.name}
        </Typography>
        <div className="mt-4">
          <AssignedUsers
            projectId={project.id}
            assignedUsers={project.assignedUsers}
          />
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-2">
        {project.labelSets?.map((item, index) => (
          <div
            key={`labelSet ${index} ${item.id}`}
            className="flex flex-row gap-1"
          >
            {item.labels.map((label) => (
              <Chip
                key={`label ${label.id}`}
                label={label.label}
                variant={item.pickOne ? "outlined" : "filled"}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-2 mt-4">
        {project.entities?.map((item, index) => (
          <Chip
            key={`entity ${index} ${item.id}`}
            label={item.name}
            variant="filled"
            color={colors[index % 6]}
          />
        ))}
      </div>
      <div className="mt-8 flex flex-row gap-4">
        {project.samples?.map((s) => (
          <div
            key={`sample - ${s.id}`}
            onClick={() => handleOpenSample(s)}
            className="flex flex-row gap-4 px-4 py-2 items-center cursor-pointer border shadow-sm rounded-lg hover:shadow-lg transition"
          >
            <div>{s.id}</div>
            <Chip
              className="!cursor-pointer"
              variant="outlined"
              avatar={<Avatar />}
              label={s.numberOfPerformer}
            />
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
              <div className="text-2xl font-black mb-10 ">New Sample</div>
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
                  />
                ))}
              </div>
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
                onClick={() => setOpenCreateSampleDrawer(false)}
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
