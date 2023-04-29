import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { TokenAnnotator } from "react-text-annotate";

export default function SampleText({ text, project, index }) {
  const [state, setState] = useState({
    value: [],
    tag: project.entities[0],
  });

  const handleChange = (value) => {
    setState({ ...state, value });
  };

  const handleTagChange = (e) => {
    setState({ ...state, tag: e.target.value });
  };

  const TEXT =
    "When Sebastian Thrun started working on self-driving cars at Google in 2007, few people outside of the company took him seriously. “I can tell you very senior CEOs of major American car companies would shake my hand and turn away because I wasn’t worth talking to,” said Thrun, now the co-founder and CEO of online higher education startup Udacity, in an interview with Recode earlier this week. A little less than a decade later, dozens of self-driving startups have cropped up while automakers around the world clamor, wallet in hand, to secure their place in the fast-moving world of fully automated transportation.";
  const TAG_COLORS = ["#00ffa2", "#ff8e84", "#ff84fb", "#84d2ff", "#efff84"];

  return (
    <React.Fragment>
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
            <MenuItem key={entity.id} value={entity}>
              {entity.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TokenAnnotator
        className="mt-4"
        style={{
          maxWidth: 500,
          lineHeight: 1.5,
        }}
        tokens={TEXT.split(" ")}
        value={state.value}
        onChange={handleChange}
        getSpan={(span) => ({
          ...span,
          tag: state.tag,
          color: TAG_COLORS[state.tag.id],
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
              background: TAG_COLORS[props.tagId],
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
              {props.tag.name}
            </span>
          </mark>
        )}
      />
    </React.Fragment>
  );
}
