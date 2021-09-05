import Typography from "@material-ui/core/Typography";
import {Box} from "@material-ui/core";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";

interface LoadMoreMessageProps {
  onClick: () => void
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(5, 0),
    width: 300
  }
}));

const LoadMoreMessage: React.FC<LoadMoreMessageProps> = ({onClick}) => {
  const classes = useStyles();

  return (
    <Button variant="contained" disableElevation color="secondary" onClick={onClick} className={classes.root}>
      Load more
    </Button>
  )
};

export default LoadMoreMessage
