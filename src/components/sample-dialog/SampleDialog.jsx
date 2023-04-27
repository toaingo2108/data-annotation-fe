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
import React, { useCallback, useEffect, useRef, useState } from "react";

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
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleMouseUp = () => {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    if (!!selection.toString()) {
      console.log(!!selection.toString());
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

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
        <Container className="my-8">
          <div className="flex flex-col gap-8">
            {sampleChose.sampleTexts?.map((text, index) => (
              <div key={text.id} className="shadow-lg rounded-md p-8">
                <Typography variant="h5" align="center">
                  {project.textTitles.split(",")[index]}
                </Typography>
                <p
                  className="font-serif mt-4 whitespace-pre-wrap font-semibold"
                  onMouseUp={handleMouseUp}
                >
                  {text.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
        {showPopup && (
          <div
            ref={popupRef}
            id="popup"
            className="w-40 h-auto shadow-lg rounded-lg overflow-hidden absolute bg-white"
          >
            {project.labelSets?.map((labelSet) => (
              <div className="flex flex-col gap-2">
                {labelSet.labels?.map((label) => (
                  <div className="flex flex-row items-center gap-2 hover:bg-neutral-100 px-4 py-1 cursor-pointer">
                    <Chip variant="outlined" label={label.label[0]} />
                    <div>{label.label}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </Dialog>
    </div>
  );
}
