import { Close } from "@mui/icons-material";
import {
  AppBar,
  Chip,
  Container,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Footer from "../Footer";
import SampleText from "./SampleText";
import sampleClient from "../../clients/sampleClient";

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SampleDialog({
  isOpen,
  project,
  sampleChose,
  onClose,
}) {
  const [open, setOpen] = useState(isOpen);
  const [sample, setSample] = useState({});

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    collectData();
  }, []);

  const collectData = () => {
    sampleClient
      .getById({
        id: sampleChose.id,
        withEntities: true,
        withGeneratedTexts: true,
      })
      .then(({ data }) => {
        setSample(data.sample);
      });
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

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
        <Container className="my-8 pb-40 min-h-screen">
          <div className="flex flex-col gap-8 relative">
            {sample.sampleTexts?.map((text, index) => (
              <div key={text.id} className="shadow-lg rounded-md p-8">
                <Typography variant="h5" align="center" className="!mb-4">
                  {project.textTitles.split(",")[index]}
                </Typography>
                <SampleText text={text} entities={project.entities} />
              </div>
            ))}
          </div>
        </Container>

        <Footer />
      </Dialog>
    </div>
  );
}
