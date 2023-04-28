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
import { AnnotationXYThreshold } from "react-annotation";

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rangeTextSelected, setRangeTextSelected] = useState({});
  const [labelSetsClient, setLabelSetsClient] = useState([]);
  const popupRef = useRef();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleMouseUp = (indexText) => (e) => {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (!selection.toString()) {
      return setShowPopup(false);
    }
    setShowPopup(true);
    setRangeTextSelected({
      projectId: project.id,
      sampleId: sampleChose.id,
      textIndex: indexText,
      start: range.startOffset,
      end: range.endOffset,
    });
  };

  const handleSetLabel = ({ id, label }) => {
    console.log(labelSetsClient);
    const payload = {
      labelId: id,
      label: label,
      ...rangeTextSelected,
    };
    console.log(payload);
    setShowPopup(false);
    setLabelSetsClient([...labelSetsClient, payload]);
  };

  useEffect(() => {
    const updateMousePosition = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener("mousemove", updateMousePosition);

    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  useEffect(() => {
    if (popupRef.current) {
      const x = position.x + 20;
      const y = position.y + 20;
      popupRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }, [showPopup]);

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
            {sampleChose.sampleTexts?.map((text, index) => (
              <div key={text.id} className="shadow-lg rounded-md p-8">
                <Typography variant="h5" align="center">
                  {project.textTitles.split(",")[index]}
                </Typography>
                <p
                  className="font-serif mt-4 whitespace-pre-wrap font-semibold"
                  onMouseUp={handleMouseUp(index)}
                  onMouseDown={() => setShowPopup(false)}
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
            className="w-60 h-auto border py-2 shadow-lg rounded-lg overflow-hidden fixed bg-white"
          >
            {project.labelSets?.map((labelSet) => (
              <div className="flex flex-col gap-2">
                {labelSet.labels?.map((label) => (
                  <div
                    key={label.id}
                    onClick={() => handleSetLabel(label)}
                    className="flex flex-row items-center gap-2 hover:bg-neutral-100 px-4 py-1 cursor-pointer"
                  >
                    <Chip
                      variant="outlined"
                      label={label.label[0]}
                      className="!cursor-pointer"
                    />
                    <div>{label.label}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        <AnnotationXYThreshold
          x={150}
          y={170}
          dy={117}
          dx={162}
          color={"#9610ff"}
          editMode={true}
          note={{
            title: "Annotations :)",
            label: "Longer text to show text wrapping",
            lineType: "horizontal",
          }}
          subject={{ x1: 0, x2: 1000 }}
        />
      </Dialog>
    </div>
  );
}
