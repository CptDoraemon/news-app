import {Theme} from "@material-ui/core";
import {CSSProperties} from "react";

export const bigNumber = (theme: Theme): CSSProperties => ({
  width: '100%',
  fontFamily: 'Open Sans,sans-serif',
  fontSize: '6rem',
  fontWeight: 800,
  margin: 0,
  lineHeight: 1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '3rem',
  }
});

export const header = (theme: Theme): CSSProperties => ({
  textAlign: 'start',
  width: '70%',
  fontFamily: 'Open Sans,sans-serif',
  textTransform: 'uppercase',
  fontSize: '2rem',
  fontWeight: 800,
  margin: theme.spacing(0, 0),
  lineHeight: 1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  }
});

export const content = (theme: Theme): CSSProperties => ({
  color: 'grey',
  textAlign: 'start',
  width: '70%',
  fontFamily: 'Open Sans,sans-serif',
  fontSize: '1rem',
  fontWeight: 800,
  margin: theme.spacing(2, 0),
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.875rem',
  }
});

export const bigNumberTitle = (theme: Theme): CSSProperties => ({
  width: '100%',
  fontFamily: 'Open Sans,sans-serif',
  fontSize: '1rem',
  fontWeight: 800,
  margin: 0,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.875rem',
  }
});
