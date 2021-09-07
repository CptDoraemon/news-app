import React, {useMemo} from "react";
import {makeStyles, Tooltip, Typography} from "@material-ui/core";
import {ArticleData} from "../use-load-articles";
import getPublishTime from "../../../tools/get-publish-time";
import getDateString from "../../../tools/get-date-string";
import HighlightedContent from "./highlighted-content";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  title: {
    lineHeight: 1.25,
  },
  subtitle: {
    width: '100%',
    margin: theme.spacing(1, 0),
    color: theme.palette.primary.light,
    '& span': {
      fontWeight: 700
    }
  },
  date: {
    borderBottom: 'dotted 1px rgba(0,0,0,0.32)',
    cursor: 'help'
  },
  content: {
    color: theme.palette.primary.light,
  }
}));

interface ArticleCardContentProps {
  data: ArticleData,
  keyword?: string
}

const ArticleCardContent = ({data, keyword}: ArticleCardContentProps) => {
  const classes = useStyles();
  const content = useMemo(() => {
    return data.content ? data.content.replace(/\[\+[0-9]+\schars\]/ig, '') : ''
  }, [data.content])

  return (
    <div className={classes.root}>
      <Typography variant={'h6'} component={'h2'} className={classes.title}>
        {
          keyword ?
            <HighlightedContent content={data.title} keyword={keyword}/> :
            data.title
        }
      </Typography>
      <div className={classes.subtitle}>
        <Typography variant={'body2'} component={'span'}>
          {data.source ? data.source + ' - ' : data.author ? data.author + ' - ' : ''}
        </Typography>
        <Tooltip title={getDateString(data.publishedAt)}>
          <Typography variant={'body2'} component={'span'} className={classes.date}>
            {getPublishTime(new Date(data.publishedAt))}
          </Typography>
        </Tooltip>
      </div>
      <Typography variant={'body2'} component={'p'} className={classes.content}>
        {
          keyword ?
            <HighlightedContent content={data.content} keyword={keyword}/> :
            data.content && data.content.replace(/\[\+[0-9]+\schars\]/ig, '')
        }
      </Typography>
    </div>
  )
};

export default ArticleCardContent
