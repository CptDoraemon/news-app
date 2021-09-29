import React, {useRef} from "react";
import {makeStyles, Paper} from "@material-ui/core";
import {SearchedArticle} from "./use-search/use-search";
import ArticleCardContent from "../articles/article-card/article-card-content";
import ArticleCardActions from "../articles/article-card/article-card-actions";
import {MOBILE} from "../../theme/theme";
import ArticleCardImage from "../articles/article-card/article-card-image";
import useLazyLoad from "../../tools/use-lazy-load";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1, 0),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    minHeight: 200,
    overflow: 'hidden'
  },
  image: {
    width: 200,
    overflow: 'hidden',
    position: 'relative',
    flex: '0 0 auto',
    [MOBILE(theme)]: {
      width: 50
    }
  },
  imageInnerWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  },
  contentArea: {
    flex: '1 1 auto',
    padding: theme.spacing(2, 4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    [MOBILE(theme)]: {
      padding: theme.spacing(0.5, 1.5),
    }
  },
  content: {
    flex: '1 1 auto'
  },
  action: {
    margin: theme.spacing(1, -0.5, 0, -0.5),
    flex: '0 0 auto'
  }
}));

interface SearchedArticleCardProps {
  data: SearchedArticle
}

const SearchedArticleCard = ({data}: SearchedArticleCardProps) => {
  const classes = useStyles();
  const rootRef = useRef<HTMLDivElement>(null);
  const isVisible = useLazyLoad(rootRef);

  return (
    <Paper elevation={0} className={classes.root} ref={rootRef}>
      <div className={classes.image}>
        <div className={classes.imageInnerWrapper}>
          <ArticleCardImage url={data.urlToImage} title={data.title} isVisible={isVisible}/>
          {/*<img src={data.urlToImage} alt={data.title} />*/}
        </div>
      </div>
      <div className={classes.contentArea}>
        <div className={classes.content}>
          <ArticleCardContent data={data}/>
        </div>
        <div className={classes.action}>
          <ArticleCardActions data={data}/>
        </div>
      </div>
    </Paper>
  )
};

export default SearchedArticleCard
