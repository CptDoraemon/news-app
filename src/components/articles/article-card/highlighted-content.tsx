import React, {useMemo} from "react";
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

  const classes = useStyles();

  const contentArray = useMemo(() => {
    const escapedKeyword = keyword.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    const re = new RegExp('(' + escapedKeyword + ')', 'gi');
    return content.split(re);
  }, [content, keyword]);

  return (
    <>
      {contentArray.map((content, i) => {
        const isKeyword = i % 2 === 1;
        return isKeyword ?
          <span className={classes.highlight} key={i}>{content}</span> :
          <span key={i}>{content}</span>
      })}
    </>
  )
};

export default HighlightedContent
