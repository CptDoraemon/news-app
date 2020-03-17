import {Theme} from "@material-ui/core";
import {CSSProperties} from "react";

export const pageRoot = (theme: Theme): CSSProperties => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: theme.spacing(2, 0, 15, 0)
});

export const page1000WidthWrapper = (theme: Theme): CSSProperties => ({
    width: '1000px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
        width: '100%'
    }
});