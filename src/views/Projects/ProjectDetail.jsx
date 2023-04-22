import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import projectClient from "../../clients/projectClient";
import { useStateContext } from "../../context/ContextProvider";
import { Avatar, Chip, Typography } from "@mui/material";
import { colors } from "../../utils/constants";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const { setLoading } = useStateContext();

  useEffect(() => {
    setLoading(true);
    projectClient
      .getProjectById({ id, withSamples: 1 })
      .then(({ data }) => {
        console.log(data.project.samples);
        setProject(data.project);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Typography
        variant="h3"
        className="overflow-hidden whitespace-nowrap text-ellipsis"
      >
        {project.name}
      </Typography>
      <hr className="mb-4" />
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
      <div className="flex flex-row gap-2">
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
          <div className="flex flex-row gap-4 px-4 py-2 items-center cursor-pointer border shadow-sm rounded-lg hover:shadow-lg transition">
            <div>{s.id}</div>
            <Chip
              clickable
              variant="outlined"
              avatar={<Avatar />}
              label={s.numberOfPerformer}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
