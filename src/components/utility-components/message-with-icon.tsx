import React from 'react';
import {makeStyles, Paper, Typography, fade} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: 250,
    backgroundColor: fade(theme.palette.primary.main, 0.04),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4a5568',
    padding: theme.spacing(2)
  },
  icon: {
    color: theme.palette.secondary.main,
    width: 75,
    height: 75
  },
  title: {
    color: 'inherit',
    fontWeight: 700,
    textAlign: 'center'
  },
  text: {
    color: 'inherit',
    fontWeight: 500,
    opacity: 0.9,
    textAlign: 'center'
  }
}))

interface MessageWithIconProps {
  title?: string,
  text?: string | JSX.Element,
  icon: JSX.Element
}

const MessageWithIcon: React.FC<MessageWithIconProps> = ({title, text, icon}) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.root}>
      {
        React.cloneElement(icon, {className: classes.icon})
      }
      {
        title &&
        <Typography variant={'h6'} className={classes.title}>
          {title}
        </Typography>
      }
      {
        text &&
        <Typography variant={'body1'} className={classes.text}>
          {text}
        </Typography>
      }
    </Paper>
  )
}

export default MessageWithIcon
