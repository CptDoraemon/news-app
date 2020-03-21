import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {content} from "../styles/analytics-styles";

const useStyles = makeStyles(theme => ({
    content: {
        ...content(theme)
    }
}));

interface ContentProps {
    value: string
}

const Content: React.FC<ContentProps> = ({value}) => {
    const classes = useStyles();

    return (
        <p className={classes.content}>
            { value }
        </p>
    )
};

export default Content