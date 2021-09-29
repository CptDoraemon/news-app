import React from "react";
import {makeStyles, Step, StepButton, StepLabel, Stepper, Typography, useMediaQuery, useTheme} from "@material-ui/core";
import YearStepperIcon from "./year-stepper-icon";
import {MOBILE} from "../../../theme/theme";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'rgba(0,0,0,0)',
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.secondary.light
    }
  },
  stepButton: {
    color: theme.palette.secondary.main,
  },
  labelText: {
    color: theme.palette.secondary.main,
  }
}));

interface YearStepperProps {
  steps: string[],
  activeStep: number,
  onStepChange: (index: number) => void
}

const YearStepper = ({steps, activeStep, onStepChange}: YearStepperProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(MOBILE(theme));

  return (
    <Stepper activeStep={activeStep} orientation={isMobile ? "horizontal" : "vertical"} className={classes.root}>
      {steps.map((label, index) => (
        <Step
          key={label}
          onClick={() => onStepChange(index)}
        >
          <StepButton
            onClick={() => onStepChange(index)}
            className={classes.stepButton}
            disabled={false}
            completed={false}
          >
            <StepLabel
              StepIconComponent={YearStepperIcon}
            >
              <Typography variant={'h6'} component={'span'} className={classes.labelText}>
                {label}
              </Typography>
            </StepLabel>
          </StepButton>
        </Step>
      ))}
    </Stepper>
  )
};

export default YearStepper
