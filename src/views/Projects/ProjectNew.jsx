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

export default function ProjectNew() {
  const { user } = useStateContext();
  const [project, setProject] = useState({
    name: "",
    description: "",
    hasLabelSets: false,
    hasEntityRecognition: false,
    numberOfTexts: 0,
    textTitles: "",
    hasGeneratedText: false,
    numberOfGeneratedTexts: null,
    maximumOfGeneratedTexts: null,
    generatedTextTitles: null,
    maximumPerformer: 0,
    projectTypeId: "",
    labelSets: [],
    entities: [],
  });

  const handleChangeProject = (e) => {
    if (
      e.target.name === "hasLabelSets" ||
      e.target.name === "hasEntityRecognition" ||
      e.target.name === "hasGeneratedText"
    ) {
      return setProject({ ...project, [e.target.name]: e.target.checked });
    }

    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(project);
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
                <MenuItem value={2}>2</MenuItem>
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
