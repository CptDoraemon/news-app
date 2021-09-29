import React from "react";
import {makeStyles, StepIcon} from "@material-ui/core";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

const useStyles = makeStyles((theme) => ({

}));

const YearStepperIcon = ({active}: React.ComponentProps<typeof StepIcon>) => {
  const classes = useStyles();
  
  return active ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon/>
};

export default YearStepperIcon
