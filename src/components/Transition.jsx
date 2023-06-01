import { Slide } from "@mui/material";
import React from "react";

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default Transition;
