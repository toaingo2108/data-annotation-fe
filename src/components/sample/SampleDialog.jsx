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
import Footer from "../Footer";
import { TextAnnotator, TokenAnnotator } from "react-text-annotate";
import SampleText from "./SampleText";

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
  const [value, setValue] = useState({});
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

  // const handleMouseUp = (textId) => (e) => {
  //   var selection = window.getSelection();
  //   var range = selection.getRangeAt(0);
  //   const rect = range.getBoundingClientRect();
  //   if (!selection.toString()) {
  //     return setShowPopup(false);
  //   }
  //   setShowPopup(true);
  //   setRangeTextSelected({
  //     // projectId: project.id,
  //     // sampleId: sampleChose.id,
  //     textId,
  //     start: range.startOffset,
  //     end: range.endOffset,
  //   });
  // };

  // const handleSetLabel = ({ id, label }) => {
  // const payload = {
  //   labelId: id,
  //   label: label,
  //   ...rangeTextSelected,
  // };

  // const index = labelSetsClient.findIndex(
  //   (item) => item.textId === payload.textId
  // );

  // if (index >= 0) {
  //   labelSetsClient[index].label.push(payload);
  // } else {
  //   labelSetsClient.push({
  //     textId: payload.textId,
  //     label: [payload],
  //   });
  // }
  // setShowPopup(false);
  // setLabelSetsClient([...labelSetsClient]);
  // setLabelSetsClient([...labelSetsClient, value]);
  // };

  // useEffect(() => {
  //   const updateMousePosition = (event) => {
  //     setPosition({ x: event.clientX, y: event.clientY });
  //   };

  //   document.addEventListener("mousemove", updateMousePosition);

  //   return () => {
  //     document.removeEventListener("mousemove", updateMousePosition);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (popupRef.current) {
  //     const x = position.x + 20;
  //     const y = position.y + 20;
  //     popupRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  //   }
  // }, [showPopup]);

  // const handleOpenSetLabel = (value) => {
  //   setShowPopup(true);
  //   setValue(value);
  // };

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
                <Typography variant="h5" align="center" className="!mb-4">
                  {project.textTitles.split(",")[index]}
                </Typography>
                <SampleText text={text} project={project} index={index} />
              </div>
            ))}
          </div>
        </Container>
        {/* {showPopup && (
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
        )} */}
        <Footer />
      </Dialog>
    </div>
  );
}
