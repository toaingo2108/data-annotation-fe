import { Close } from "@mui/icons-material";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import React from "react";

const MySpeedDial = ({ actions }) => {
  const showActions = actions.filter((action) => !!action.isShow);

  if (!showActions || !showActions.length) {
    return;
  }
  
  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: "fixed", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon openIcon={<Close />} />}
    >
      {showActions.map((action) => {
        return (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        );
      })}
    </SpeedDial>
  );
};

export default MySpeedDial;
