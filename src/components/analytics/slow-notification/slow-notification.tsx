import React from "react";
import {Button, makeStyles, Snackbar, Typography} from "@material-ui/core";
import useSlowNotification from "./use-slow-notification";

const useStyles = makeStyles((theme) => ({
  message: {
    maxHeight: '60vh',
    overflowY: 'auto',
    padding: theme.spacing(2, 4),
    '& h5': {
      marginBottom: theme.spacing(4),
      '& strong': {
        color: theme.palette.warning.main
      }
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
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={isOpen}
      autoHideDuration={null}
      message={
        <div className={classes.message}>
          <Typography variant={'h6'} component={'h5'}>
            You might ask, why <strong>this page takes very long</strong> to load?
          </Typography>
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
      }
      action={
        <Button
          variant={'contained'}
          color={'secondary'}
          disableElevation
          onClick={handleClose}
        >
          Close
        </Button>
      }
    />
  )
};

export default SlowNotification
