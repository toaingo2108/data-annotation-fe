import { Close } from "@mui/icons-material";
import {
  AppBar,
  Chip,
  Container,
  Dialog,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SampleText from "./SampleText";
import sampleClient from "../../clients/sampleClient";
import GeneratedTexts from "./GeneratedTexts";
import { useStateContext } from "../../context/ContextProvider";
import Transition from "../Transition";

export default function SampleDialog({
  isOpen,
  project,
  sampleChose,
  onClose,
}) {
  const { user, loading, setLoading } = useStateContext();
  const [open, setOpen] = useState(isOpen);
  const [sample, setSample] = useState({});

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
        withEntities: true,
        withGeneratedTexts: true,
      })
      .then(({ data }) => {
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
            <Typography sx={{ ml: 2 }} variant="h6" component="div">
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
          <div className="flex flex-col gap-8 relative">
            {sample.sampleTexts?.map((text, index) => (
              <div key={text.id} className="shadow-lg rounded-md p-8 border">
                <Typography variant="h5" align="center" className="!mb-4">
                  {project.textTitles.split(",")[index]}
                </Typography>
                <SampleText text={text} entities={project.entities} />
              </div>
            ))}

            {!!project.hasGeneratedText && (
              <div className="shadow-lg rounded-md p-8 border">
                <GeneratedTexts
                  generatedTextTitles={project.generatedTextTitles?.split(",")}
                  generatedTexts={
                    sample.generatedTexts?.filter(
                      (item) => item.performerId === user.id
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
