import React from "react";
import Typography from "@material-ui/core/Typography";
import {Box} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2, 0)
    }
}));

interface GenericMessageProps {
    message: string,
    divider?: boolean
}

const GenericMessage: React.FC<GenericMessageProps> = ({message, divider}) => {
    const classes = useStyles();

    return (
        <>
            <Typography variant="body1" component="div" className={classes.root}>
                <Box fontWeight={700}>
                    {message}
                </Box>
            </Typography>
            { divider && <Divider style={{width: '100%'}}/> }
        </>
    )
};

export default GenericMessage