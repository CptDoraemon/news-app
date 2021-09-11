import React, {useMemo} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  title: {
    textAlign: 'start',
    width: '70%',
    textTransform: 'uppercase',
    fontWeight: 900,
    lineHeight: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  }
}));

interface TitleProps {
  value: string | string[]
}

const Title: React.FC<TitleProps> = ({value}) => {
  const classes = useStyles();
  const words = useMemo(() => Array.isArray(value) ? value : value.split(' '), [value]);

  return (
    <Typography component={'h2'} variant={'h4'} className={classes.title}>
      {
        words.map((word, i) => (
          <span key={i}>{word}</span>
        ))
      }
    </Typography>
  )
};

export default Title
