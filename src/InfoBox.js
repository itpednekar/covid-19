import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./InfoBox.css";
function InfoBox({ title, cases, active, total, isRed, isGreen,...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red" 
      }  ${isGreen && "infoBox--green"}`}
    >
      <CardContent>
        <Typography color="primary" className="infoBox__title">
         <h3>{title}</h3> 
        </Typography>
        <h2 className="infoBox__cases">{cases}</h2>
        <Typography color="initial" className="infoBox__total">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
