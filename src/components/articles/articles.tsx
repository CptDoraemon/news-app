import React from "react";
import {Box, makeStyles} from "@material-ui/core";
import {useMount} from "react-use";
import useLoadArticles from "./use-load-articles";
import {Skeleton} from "@material-ui/lab";
import Swipeable from "../utility-components/swipeable";
import InfoIcon from '@material-ui/icons/Info';
import MessageWithIcon from "../utility-components/message-with-icon";
import ArticleCard from "./article-card/article-card";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    }
  },
  skeletonCardWrapper: {
    margin: theme.spacing(2),
    width: 'fit-content',
  },
  skeleton: {
    maxWidth: '100%'
  }
}));

interface ArticlesProps {
  category: string,
  goPreviousCategory: () => void,
  goNextCategory: () => void
}

const Articles = ({category, goNextCategory, goPreviousCategory}: ArticlesProps) => {
  const classes = useStyles();
  const requestState = useLoadArticles(category);

  useMount(() => window.scrollTo(0, 0));

  return (
    <Swipeable goNext={goNextCategory} goPrevious={goPreviousCategory}>
      <div className={classes.root}>
        {
          requestState.isLoading &&
          new Array(10).fill(1).map((_, i) => {
            return (
              <Box width={500} maxWidth={'100%'} className={classes.skeletonCardWrapper} key={i}>
                <Skeleton variant={"rect"} width={500} height={200} className={classes.skeleton}/>
                <Skeleton width={500} className={classes.skeleton}/>
                <Skeleton width={500} className={classes.skeleton}/>
              </Box>
            )
          })
        }
        {
          !requestState.isLoading && requestState.isError &&
          <MessageWithIcon icon={<InfoIcon/>} title={'Ooops'} text={'We met an error, please try again later'}/>
        }
        {
          !requestState.isLoading && !requestState.isError && !requestState.data &&
          <MessageWithIcon icon={<InfoIcon/>} title={'Ooops'} text={'No news article found'}/>
        }
        {
          !requestState.isLoading && !requestState.isError && !!requestState.data &&
          requestState.data.map((article, i) => (
            <ArticleCard key={i} variant={i === 0 || i === 1 ? 'big' : 'normal'} data={article}/>
          ))
        }
      </div>
    </Swipeable>
  )
};

export default Articles
