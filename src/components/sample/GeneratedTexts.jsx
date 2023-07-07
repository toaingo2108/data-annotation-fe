import {
  Button,
  FilledInput,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import sampleClient from "../../clients/sampleClient";
import { enqueueSnackbar } from "notistack";

export default function GeneratedTexts({
  generatedTextTitles,
  generatedTexts,
  sampleId,
  performerId,
}) {
  const [texts, setTexts] = useState(
    generatedTextTitles?.map((_, index) =>
      generatedTexts[index]
        ? generatedTexts[index]
        : { text: "" }
    )
  );

  const handleChangeGeneratedText = (index) => (e) => {
    texts[index].text = e.target.value;
    setTexts([...texts]);
  };

  const handleUpdateAnnotation = () => {
    sampleClient
      .addAnnotation({
        id: sampleId,
        generated_texts: texts.map((text) => text.text),
        userId: performerId,
      })
      .then(() => {
        enqueueSnackbar({
          message: "Updated successfully!",
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
      });
  };

  // const handleDeleteGeneratedText = (index) => {
  //   texts[index].text = "";
  //   setTexts([...texts]);
  // };

  return (
    <React.Fragment>
      <div className="flex flex-row justify-end gap-2">
        <Button
          variant="contained"
          onClick={handleUpdateAnnotation}
        >
          Save
        </Button>
      </div>
      {generatedTextTitles?.map((title, index) => (
        <div key={`title-${index}`} className="mb-10">
          <Typography
            variant="h5"
            align="center"
            className="!mb-2"
          >
            {title}
          </Typography>

          <FilledInput
            variant="filled"
            fullWidth
            value={texts[index]?.text}
            maxRows={10}
            multiline
            onChange={handleChangeGeneratedText(index)}
          />
          {index + 1 < generatedTextTitles.length && <hr />}
        </div>
      ))}
    </React.Fragment>
  );
}
