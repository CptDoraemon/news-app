import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {header} from "../styles/analytics-styles";

const useStyles = makeStyles(theme => ({
    title: {
        ...header(theme)
    }
}));

interface TitleProps {
    value: string | string[]
}

const Title: React.FC<TitleProps> = ({value}) => {
    const classes = useStyles();

    if (Array.isArray(value)) {
        return (
            <>
                {
                    value.map((str, i) =>
                        <h2 className={classes.title} key={i}>
                            { str }
                        </h2>
                    )
                }
            </>
        )
    } else {
        return (
            <>
                {
                    value.split(' ').map((str, i) =>
                        <h2 className={classes.title} key={i}>
                            { str }
                        </h2>
                    )
                }
            </>
        )
    }
};

export default Title