import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import NotFound from "../NotFound";
import { rolesCode } from "../../utils/roles";
import { useStateContext } from "../../context/ContextProvider";
import projectClient from "../../clients/projectClient";
import { enqueueSnackbar } from "notistack";

export default function ProjectNew() {
  const { user } = useStateContext();

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
  }
  const [project, setProject] = useState(initProject);

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
    console.log(payload);
    projectClient
      .createProject(payload)
      .then((data) => {
        console.log(data);
        enqueueSnackbar({
          message: "Created project successfully!",
          variant: "success",
        });
        setProject(initProject);
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar({
          message: err.response.data.error || err.response.data.message,
          variant: "error",
        });
      });
  };

  if (![rolesCode.MANAGER].includes(user.role?.toUpperCase())) {
    return <NotFound />;
  }

  return (
    <div>
      <Typography variant="h3">New Project</Typography>
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
              value={project.numberOfTexts}
              name="numberOfTexts"
              label="Number Of Texts"
              size="small"
              required
              margin="normal"
              fullWidth
              type="number"
              onChange={handleChangeProject}
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
            <FormControl fullWidth margin="normal" size="small">
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
                {/* {projectTypes.map((type) => (
                  <MenuItem key={type.name} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))} */}
                <MenuItem value={4}>4</MenuItem>
              </Select>
            </FormControl>
            <div className="flex flex-row items-start justify-between">
              <FormControlLabel
                className="flex-1"
                name="hasLabelSets"
                checked={project.hasLabelSets}
                control={<Checkbox />}
                label="Has Label Sets"
                onChange={handleChangeProject}
              />
            </div>
            <div className="flex flex-row items-start justify-between">
              <FormControlLabel
                className="flex-1"
                name="hasEntityRecognition"
                checked={project.hasEntityRecognition}
                control={<Checkbox />}
                label="Has Entity Recognition"
                onChange={handleChangeProject}
              />
            </div>
            <div className="flex flex-row items-start justify-between">
              <FormControlLabel
                className="flex-1"
                name="hasGeneratedText"
                checked={project.hasGeneratedText}
                control={<Checkbox />}
                label="Has Generated Text"
                onChange={handleChangeProject}
              />
              {project.hasGeneratedText && (
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
                  />
                </div>
              )}
            </div>
          </FormGroup>

          <Button type="submit" variant="contained" className="!mt-6">
            Create
          </Button>
        </div>
      </Box>
    </div>
  );
}
