import React from "react";
import {duration, makeStyles, Theme} from "@material-ui/core";
import transitions from "@material-ui/core/styles/transitions";
import clsx from 'clsx';

const useStyles = makeStyles<Theme, {direction: 'left' | 'right', duration: number}>((theme) => ({
  root: {
   transition: (props) => `opacity ${props.duration}ms, transform ${props.duration}ms`
  },
  inActive: {
    opacity: 0,
    transform: (props) => `translateX(${props.direction === 'left' ? '200%' : '-200%'})`
  },
  active: {
    opacity: 1,
    transform: `translateX(0)`
  }
}));

interface FadeAndSlideInProps {
  active: boolean,
  direction: 'left' | 'right',
  children: JSX.Element
}

const FadeAndSlideIn = ({active, direction, children}: FadeAndSlideInProps) => {
  const classes = useStyles({direction, duration: 600});

  return (
    <div className={clsx(classes.root, active ? classes.active : classes.inActive)}>
      {children}
    </div>
  )
};

export default FadeAndSlideIn
