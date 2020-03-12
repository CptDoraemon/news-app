import React from "react";
import Typography from "@material-ui/core/Typography";
import {Box} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2, 0)
    }
}));

interface ResultsCountMessageProps {
    count: number,
    keyword: string
}

const ResultsCountMessage: React.FC<ResultsCountMessageProps> = ({count, keyword}) => {
    const article = count === 1 ? 'article' : 'articles';
    const classes = useStyles();

    return (
        <Typography variant="body1" component="div" className={classes.root}>
            <Box fontWeight={700}>
                {`${count} news ${article} found related to "${keyword}"`}
            </Box>
        </Typography>
    )
};

export default ResultsCountMessage