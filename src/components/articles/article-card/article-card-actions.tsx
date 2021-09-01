import React from "react";
import {Button, makeStyles} from "@material-ui/core";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import ShareIcon from '@material-ui/icons/Share';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: theme.spacing(-1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  button: {
    margin: theme.spacing(1)
  }
}));

interface ArticleCardActionsProps {}

const ArticleCardActions = () => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Button variant={'contained'} disableElevation className={classes.button} startIcon={<OpenInNewIcon/>}>
        Learn More
      </Button>
      <Button variant={'contained'} disableElevation className={classes.button} startIcon={<ShareIcon/>}>
        Share
      </Button>
    </div>
  )
};

export default ArticleCardActions
