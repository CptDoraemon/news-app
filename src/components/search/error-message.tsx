import React, {useState} from "react";
import {Collapse, lighten, makeStyles, Typography} from "@material-ui/core";
import {useMount} from "react-use";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: lighten(theme.palette.error.main, 0.9),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  iconWrapper: {
    backgroundColor: theme.palette.error.main,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 900
  },
  messageWrapper: {
    color: 'rgba(0,0,0,0.64)',
    padding: theme.spacing(2),
    '& span': {
      fontWeight: 700
    }
  }
}));

interface ErrorMessageProps {
  message: string
}

const ErrorMessage = ({message}: ErrorMessageProps) => {
  const classes = useStyles();
  const [mounted, setMounted] = useState(false);
  useMount(() => setMounted(true));

  return (
    <Collapse in={mounted}>
      <div className={classes.root}>
        <div className={classes.iconWrapper}>
          <ErrorOutlineIcon className={classes.icon}/>
        </div>
        <div className={classes.messageWrapper}>
          <Typography variant={'body1'} component={'span'} color={'inherit'}>
            {message}
          </Typography>
        </div>
      </div>
    </Collapse>
  )
};

export default ErrorMessage
