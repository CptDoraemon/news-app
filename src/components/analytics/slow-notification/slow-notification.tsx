import React from "react";
import {Button, Dialog, DialogActions, DialogContent, makeStyles, Typography} from "@material-ui/core";
import useSlowNotification from "./use-slow-notification";
import DialogTitleWithCloseIcon from "./dialog-with-close-icon";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& h5': {
      marginBottom: theme.spacing(4),
      '& strong': {
        color: theme.palette.warning.main
      }
    },
  },
  message: {
    '& ol': {
      margin: 0,
    },
    '& li': {
      margin: theme.spacing(2, 0)
    },
  }
}));

interface SlowNotificationProps {}

const SlowNotification = () => {
  const classes = useStyles();
  const {isOpen, handleClose} = useSlowNotification();

  return (
    <Dialog open={isOpen} onClose={() => false} classes={{paper: classes.root}}>
      <DialogTitleWithCloseIcon onClose={handleClose}>
        <Typography variant={'h6'} component={'h5'}>
          You might ask, why <strong>this page takes very long</strong> to load?
        </Typography>
      </DialogTitleWithCloseIcon>

      <DialogContent>
        <div className={classes.message}>
          <ol>
            <Typography variant={'body1'} component={'li'}>
              Initially this report functionality had a in memory cache mechanism built on server.
              The server restarts once everyday, and the report get generated and cached in memory shortly after the server is rebooted.
            </Typography>
            <Typography variant={'body1'} component={'li'}>
              In the recent upgrade of this app, the database used to generate this report has been migrated to Elasticsearch from MongoDB,
              and ES has built in cache mechanism for frequently requested data. However this app is running on a 1 core 2GB memory server, and Elasticsearch is
              hungry for memory. The memory used to cache this query can be reclaimed much sooner than if this app was deployed on a better server.
            </Typography>
          </ol>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant={'contained'} disableElevation onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default SlowNotification
