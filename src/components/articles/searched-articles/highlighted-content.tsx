import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => createStyles({
    highlight: {
        backgroundColor: theme.palette.secondary.light,
    }
}));

interface HighlightedContentProps {
    content: string,
    keyword: string
}

const HighlightedContent: React.FC<HighlightedContentProps> = ({content, keyword}) => {
    const re= new RegExp('('+keyword+')', 'gi');
    const contentArray = content.split(re);

    const classes = useStyles();

    return (
        <>
            {contentArray.map((content, i) => {
                const isKeyword = i % 2 === 1;
                return isKeyword ?
                    <span className={classes.highlight}>{ content }</span> :
                    content
            })}
        </>
    )
};

export default HighlightedContent