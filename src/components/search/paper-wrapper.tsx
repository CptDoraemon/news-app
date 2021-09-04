import React from "react";
import {makeStyles, Paper} from "@material-ui/core";
import {MOBILE} from "../../theme";

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		padding: theme.spacing(2, 4),
		margin: theme.spacing(1, 0),
		[MOBILE(theme)]: {
			padding: theme.spacing(1),
		}
	},
}));

interface PaperWrapperProps {
	children: JSX.Element
}

const PaperWrapper = ({children}: PaperWrapperProps) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root} elevation={0}>
			{children}
    </Paper>
  )
};

export default PaperWrapper
