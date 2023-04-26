import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import NotFound from "../NotFound";
import { rolesCode } from "../../utils/roles";
import { useStateContext } from "../../context/ContextProvider";
import projectClient from "../../clients/projectClient";
import { enqueueSnackbar } from "notistack";
import projectTypeClient from "../../clients/projectTypeClient";
import { useParams } from "react-router-dom";
import { Add, Clear } from "@mui/icons-material";
import { colors } from "../../utils/constants";

export default function ProjectForm() {
  const { id } = useParams();
  const { user, loading, setLoading } = useStateContext();
  const [projectTypes, setProjectTypes] = useState([]);

  useEffect(() => {
    collectData({});
  }, []);

  const collectData = () => {
    setLoading(true);
    let requests = [projectTypeClient.getAll()];
    if (id) requests.push(projectClient.getProjectById({ id }));
    Promise.all(requests)
      .then((values) => {
        setProjectTypes(values[0].data.projectTypes);
        if (id) {
          setProject(values[1].data.project);
        }
      })
      .catch((err) => {
        enqueueSnackbar({
          message: err.response.data.error,
          variant: "error",
        });
        setProject(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const initProject = {
    name: "",
    description: "",
    hasLabelSets: false,
    hasEntityRecognition: false,
    numberOfTexts: 0,
    textTitles: "",
    hasGeneratedText: false,
    numberOfGeneratedTexts: 0,
    maximumOfGeneratedTexts: 0,
    generatedTextTitles: "",
    maximumPerformer: 0,
    projectTypeId: "",
    labelSets: [],
    entities: [],
  };
  const [project, setProject] = useState(initProject);

  const initLabelSetNew = {
    pickOne: false,
    labels: "",
  };
  const [labelSetNew, setLabelSetNew] = useState(initLabelSetNew);

  const [entityNew, setEntityNew] = useState("");

  const handleChangeProject = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    switch (name) {
      case "numberOfTexts":
      case "numberOfGeneratedTexts":
      case "maximumOfGeneratedTexts":
      case "maximumPerformer":
        if (isNaN(value)) return;
        if (value === "") {
          e.target.value = 0;
        }
        value = +value;
        e.target.value = value;
        break;

      case "hasLabelSets":
      case "hasEntityRecognition":
      case "hasGeneratedText":
        return setProject({ ...project, [name]: e.target.checked });
      default:
        break;
    }

    setProject({ ...project, [name]: value });
  };

  const handleChangeLabelSet = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    switch (name) {
      case "pickOne":
        return setLabelSetNew({ ...labelSetNew, [name]: e.target.checked });
      default:
        break;
    }

    setLabelSetNew({ ...labelSetNew, [name]: value });
  };

  const handleAddNewLabelSet = () => {
    setProject({
      ...project,
      labelSets: [
        ...project.labelSets,
        {
          pickOne: labelSetNew.pickOne,
          labels: labelSetNew.labels.split(","),
        },
      ],
    });
    setLabelSetNew(initLabelSetNew);
  };

  const handleClearLabelSet = (index) => {
    project.labelSets.splice(index, 1);
    setProject({ ...project });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = project;
    if (!payload.hasLabelSets) {
      delete payload.labelSets;
    }
    if (!payload.hasEntityRecognition) {
      delete payload.entities;
    }
    if (!payload.hasGeneratedText) {
      payload.numberOfGeneratedTexts = null;
      payload.maximumOfGeneratedTexts = null;
      payload.generatedTextTitles = null;
    }
    if (project.id) {
      projectClient
        .updateProject(project)
        .then(({ data }) => {
          setProject(data.project);
          enqueueSnackbar({
            message: "Updated project successfully!",
            variant: "success",
          });
        })
        .catch((err) => {
          enqueueSnackbar({
            message: err.response.data.error || err.response.data.message,
            variant: "error",
          });
        });
    } else {
      projectClient
        .createProject(payload)
        .then((data) => {
          enqueueSnackbar({
            message: "Created project successfully!",
            variant: "success",
          });
          setProject(initProject);
        })
        .catch((err) => {
          enqueueSnackbar({
            message: err.response.data.error || err.response.data.message,
            variant: "error",
          });
        });
    }
  };

  if (![rolesCode.MANAGER].includes(user.role?.toUpperCase()) || !project) {
    return <NotFound />;
  }

  return (
    <div>
      <Typography variant="h3">
        {!!id ? "Update Project" : "New Project"}
      </Typography>
      <Box component="form" className="mt-4" onSubmit={onSubmit}>
        <div className="flex flex-col">
          <TextField
            value={project.name}
            name="name"
            label="Name"
            size="small"
            autoFocus
            margin="normal"
            required
            onChange={handleChangeProject}
          />
          <TextField
            value={project.description}
            name="description"
            label="Description"
            size="small"
            margin="normal"
            multiline
            rows={4}
            onChange={handleChangeProject}
          />
          <div className="flex flex-row gap-2">
            <TextField
              className="flex-1"
              value={project.maximumPerformer}
              name="maximumPerformer"
              label="Maximum  Performer"
              size="small"
              required
              margin="normal"
              fullWidth
              type="number"
              onChange={handleChangeProject}
            />
            <TextField
              className="flex-1"
              value={project.numberOfTexts}
              name="numberOfTexts"
              label="Number Of Texts"
              size="small"
              required
              margin="normal"
              fullWidth
              type="number"
              onChange={handleChangeProject}
              disabled={!!project.id}
            />
            <TextField
              className="flex-1"
              value={project.textTitles}
              name="textTitles"
              label="Text Titles"
              size="small"
              required
              margin="normal"
              fullWidth
              onChange={handleChangeProject}
            />
          </div>
          <FormGroup>
            <FormControl
              fullWidth
              margin="normal"
              size="small"
              disabled={!!project.id}
            >
              <InputLabel id="project-type-select-label">
                Project Type
              </InputLabel>
              <Select
                labelId="project-type-select-label"
                value={project.projectTypeId}
                label="Project Type"
                name="projectTypeId"
                size="small"
                required
                onChange={handleChangeProject}
              >
                {projectTypes.map((type) => (
                  <MenuItem key={`project-type-${type.id}`} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="flex flex-row items-start justify-between">
              <FormControlLabel
                className="flex-1"
                name="hasLabelSets"
                checked={!!project.hasLabelSets}
                control={<Checkbox />}
                label="Has Label Sets"
                onChange={handleChangeProject}
                disabled={!!project.id}
              />
              {!!project.hasLabelSets && (
                <div className="flex-1 flex flex-col gap-2">
                  {project.labelSets.map((labelSet, index) => (
                    <React.Fragment key={`label ${index}`}>
                      <div className="grid grid-cols-3 items-center gap-2">
                        <FormControlLabel
                          className="flex-1"
                          checked={!!labelSet.pickOne}
                          control={<Checkbox />}
                          label="Pick one"
                          disabled
                        />
                        <TextField
                          className="col-span-2"
                          value={
                            !project.id
                              ? labelSet.labels.join(",")
                              : labelSet.labels
                                  .map((label) => label.label)
                                  .join(",")
                          }
                          label="Labels"
                          size="small"
                          required
                          margin="normal"
                          fullWidth
                          disabled
                          InputProps={
                            !project.id
                              ? {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleClearLabelSet(index)
                                        }
                                      >
                                        <Clear />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }
                              : {}
                          }
                        />
                      </div>
                      <hr />
                    </React.Fragment>
                  ))}
                  {!project.id && (
                    <div className="grid grid-cols-3 items-center gap-2">
                      <FormControlLabel
                        key="label new"
                        name="pickOne"
                        checked={!!labelSetNew.pickOne}
                        control={<Checkbox />}
                        label="Pick one"
                        onChange={handleChangeLabelSet}
                      />
                      <TextField
                        className="col-span-2"
                        value={labelSetNew.labels}
                        name="labels"
                        label="Labels"
                        margin="normal"
                        size="small"
                        fullWidth
                        onChange={handleChangeLabelSet}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => handleAddNewLabelSet()}
                              >
                                <Add />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 items-start">
              <FormControlLabel
                className="w-1/2"
                name="hasEntityRecognition"
                checked={!!project.hasEntityRecognition}
                control={<Checkbox />}
                label="Has Entity Recognition"
                onChange={handleChangeProject}
                disabled={!!project.id}
              />
              {!!project.hasEntityRecognition && (
                <div className="flex flex-col flex-1">
                  <div className="flex flex-row gap-2 flex-wrap">
                    {project.entities.map((entity, index) => (
                      <Chip
                        key={`entity ${index}`}
                        label={entity.name}
                        onDelete={() => {
                          project.entities.splice(index, 1);
                          setProject({ ...project });
                        }}
                        color={colors[index % 6]}
                      />
                    ))}
                  </div>
                  {!project.id && (
                    <>
                      <hr className="my-2" />
                      <div className="grid items-center gap-2">
                        <TextField
                          value={entityNew}
                          label="New Entity"
                          margin="normal"
                          size="small"
                          fullWidth
                          onChange={(e) => setEntityNew(e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  disabled={entityNew === ""}
                                  size="small"
                                  onClick={() => {
                                    project.entities.push({ name: entityNew });
                                    setProject({ ...project });
                                    setEntityNew("");
                                  }}
                                >
                                  <Add />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-row items-start justify-between">
              <FormControlLabel
                className="flex-1"
                name="hasGeneratedText"
                checked={!!project.hasGeneratedText}
                control={<Checkbox />}
                label="Has Generated Text"
                onChange={handleChangeProject}
                disabled={!!project.id}
              />
              {!!project.hasGeneratedText && (
                <div className="flex-1 flex flex-row gap-2">
                  <TextField
                    value={project.numberOfGeneratedTexts}
                    name="numberOfGeneratedTexts"
                    label="Number Of Generated Texts"
                    size="small"
                    required
                    type="number"
                    fullWidth
                    onChange={handleChangeProject}
                    disabled={!!project.id}
                  />
                  <TextField
                    value={project.maximumOfGeneratedTexts}
                    name="maximumOfGeneratedTexts"
                    label="Maximum Of Generated Texts"
                    size="small"
                    required
                    type="number"
                    fullWidth
                    onChange={handleChangeProject}
                    disabled={!!project.id}
                  />
                </div>
              )}
            </div>
          </FormGroup>

          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            className="!mt-6"
          >
            {!!id ? "Update" : "Create"}
          </Button>
        </div>
      </Box>
    </div>
  );
}
