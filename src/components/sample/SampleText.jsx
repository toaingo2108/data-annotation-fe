import { Save } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { TokenAnnotator } from "react-text-annotate";

export default function SampleText({ text, project }) {
  const [state, setState] = useState({
    value: [],
    tag: project.entities[0].name,
  });

  const handleChange = (value) => {
    setState({ ...state, value });
  };

  const handleTagChange = (e) => {
    setState({ ...state, tag: e.target.value });
  };

  const TAG_COLORS = useMemo(
    () =>
      project?.entities?.reduce(
        (item, value, index) => ({
          ...item,
          [value.name]: ["#00ffa2", "#ff8e84", "#ff84fb", "#84d2ff", "#efff84"][
            index
          ],
        }),
        {}
      ),
    [project]
  );

  const handleSaveAnnotation = () => {
    console.log(state.value);
  };

  return (
    <React.Fragment>
      <div className="flex flex-row items-center gap-4">
        <FormControl size="small" className="w-60">
          <InputLabel id={`select-label${text.id}`}>Label</InputLabel>
          <Select
            labelId={`select-label${text.id}`}
            id={`select-label-id-${text.id}`}
            value={state.tag}
            label="Label"
            onChange={handleTagChange}
          >
            {project.entities?.map((entity, index) => (
              <MenuItem key={entity.id} value={entity.name}>
                {entity.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton
          color="primary"
          size="small"
          onClick={() => handleSaveAnnotation()}
        >
          <Save />
        </IconButton>
      </div>
      <TokenAnnotator
        className="mt-4"
        style={{
          maxWidth: 500,
          lineHeight: 1.5,
        }}
        tokens={text.text.split(" ")}
        value={state.value}
        onChange={handleChange}
        getSpan={(span) => ({
          ...span,
          tag: state.tag,
          color: TAG_COLORS[state.tag],
        })}
        renderMark={(props) => (
          <mark
            key={props.key}
            onClick={() =>
              props.onClick({
                start: props.start,
                end: props.end,
                text: props.text,
                tag: props.tag,
                color: props.color,
              })
            }
            style={{
              padding: ".2em .3em",
              margin: "0 .25em",
              lineHeight: "1",
              display: "inline-block",
              borderRadius: ".25em",
              background: TAG_COLORS[props.tag],
            }}
          >
            {props.content}
            <span
              style={{
                boxSizing: "border-box",
                content: "attr(data-entity)",
                fontSize: ".55em",
                lineHeight: "1",
                padding: ".35em .35em",
                borderRadius: ".35em",
                textTransform: "uppercase",
                display: "inline-block",
                verticalAlign: "middle",
                margin: "0 0 .15rem .5rem",
                background: "#fff",
                fontWeight: "700",
              }}
            >
              {props.tag}
            </span>
          </mark>
        )}
      />
    </React.Fragment>
  );
}
