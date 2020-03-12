import React from "react";
import Typography from "@material-ui/core/Typography";
import {Box} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2, 0)
    }
}));

interface GenericMessageProps {
    message: string
}

const GenericMessage: React.FC<GenericMessageProps> = ({message}) => {
    const classes = useStyles();

    return (
        <Typography variant="body1" component="div" className={classes.root}>
            <Box fontWeight={700}>
                {message}
            </Box>
        </Typography>
    )
};

export default GenericMessage