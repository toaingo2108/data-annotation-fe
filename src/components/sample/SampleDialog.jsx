import { Check, Close } from "@mui/icons-material";
import {
  AppBar,
  Chip,
  Container,
  Dialog,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import SampleText from "./SampleText";
import sampleClient from "../../clients/sampleClient";
import GeneratedTexts from "./GeneratedTexts";
import { useStateContext } from "../../context/ContextProvider";
import Transition from "../Transition";
import { enqueueSnackbar } from "notistack";

export default function SampleDialog({
  isOpen,
  project,
  sampleChose,
  onClose,
}) {
  const { user, loading, setLoading } = useStateContext();
  const [open, setOpen] = useState(isOpen);
  const [sample, setSample] = useState({});
  const [lableSetPicked, setLableSetPicked] = useState([]);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    collectData();
  }, []);

  const collectData = () => {
    setLoading(true);
    sampleClient
      .getById({
        id: sampleChose.id,
        withLabelSets: true,
        withEntities: true,
        withGeneratedTexts: true,
      })
      .then(({ data }) => {
        setLableSetPicked(data.labelSets);
        setSample(data.sample);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handlePickLableSet = (
    lableSetIndex,
    isPickOne,
    labelIndex,
    isPicked
  ) => {
    if (isPickOne) {
      lableSetPicked[lableSetIndex].labels = lableSetPicked[
        lableSetIndex
      ].labels.map((label, idx) => {
        return {
          ...label,
          picked: idx === labelIndex,
        };
      });
    } else {
      lableSetPicked[lableSetIndex].labels[
        labelIndex
      ].picked = !isPicked;
    }

    let labeling = {};

    lableSetPicked.forEach((item) => {
      labeling[item.id] = item.labels
        .filter((label) => label.picked)
        .map((item) => item.id);
    });

    sampleClient
      .addAnnotation({
        id: sample.id,
        labeling,
      })
      .then((data) => {
        enqueueSnackbar({
          message: "Updated suscessfully!",
          variant: "success",
        });
        setLableSetPicked([...lableSetPicked]);
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

  if (loading) return;

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => handleClose()}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Typography
              sx={{ ml: 2 }}
              variant="h6"
              component="div"
            >
              {project.name}
            </Typography>
            <div className="ml-2 flex-1">
              <Chip
                variant="filled"
                className="!bg-neutral-200"
                label={project.projectType?.name}
              />
            </div>
          </Toolbar>
        </AppBar>
        <Container className="my-8 pb-40">
          {!!lableSetPicked?.length && (
            <div className="flex flex-col gap-2 mb-8">
              {lableSetPicked?.map((item, index) => (
                <div
                  key={`labelSet ${index} ${item.id}`}
                  className="flex flex-row gap-1 items-center"
                >
                  <span className="w-20">
                    {item.pickOne
                      ? "Pick one"
                      : "Pick multi"}
                    :
                  </span>
                  {item.labels.map((label, labelIndex) => (
                    <Chip
                      icon={label.picked ? <Check /> : ""}
                      key={`label ${label.id}`}
                      label={label.label}
                      variant={
                        item.pickOne ? "outlined" : "filled"
                      }
                      color={
                        label.picked ? "success" : "default"
                      }
                      onClick={() =>
                        handlePickLableSet(
                          index,
                          item.pickOne,
                          labelIndex,
                          label.picked
                        )
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-8 relative">
            {sample.sampleTexts?.map((text, index) => (
              <div
                key={text.id}
                className="shadow-lg rounded-md p-8 border"
              >
                <Typography
                  variant="h5"
                  align="center"
                  className="!mb-4"
                >
                  {project.textTitles.split(",")[index]}
                </Typography>
                <SampleText
                  text={text}
                  entities={project.entities}
                />
              </div>
            ))}

            {!!project.hasGeneratedText &&
              project.generatedTextTitles && (
                <div className="shadow-lg rounded-md p-8 border">
                  <GeneratedTexts
                    generatedTextTitles={project.generatedTextTitles?.split(
                      ","
                    )}
                    generatedTexts={
                      sample.generatedTexts?.filter(
                        (item) =>
                          item.performerId === user.id
                      ) || []
                    }
                    sampleId={sample.id}
                  />
                </div>
              )}
          </div>
        </Container>

        {/* <Footer /> */}
      </Dialog>
    </div>
  );
}
