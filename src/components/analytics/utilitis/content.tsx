import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Typography} from "@material-ui/core";
import {grey} from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  content: {
    width: '70%',
    textAlign: 'start',
    fontSize: theme.typography.h6.fontSize,
    fontWeight: 600,
    color: grey[700],
    margin: theme.spacing(1, 0)
  }
}));

interface ContentProps {
  value: string
}

const Content: React.FC<ContentProps> = ({value}) => {
  const classes = useStyles();

  return (
    <Typography variant={'body1'} component={'p'} className={classes.content}>
      {value}
    </Typography>
  )
};

export default Content
