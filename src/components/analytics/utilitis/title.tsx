import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {header} from "../styles/analytics-styles";

const useStyles = makeStyles(theme => ({
    title: {
        ...header(theme)
    }
}));

interface TitleProps {
    value: string
}

const Title: React.FC<TitleProps> = ({value}) => {
    const classes = useStyles();

    return (
        <h2 className={classes.title}>
            { value }
        </h2>
    )
};

export default Title