import React from "react";
import {Button, CircularProgress, makeStyles, Typography} from "@material-ui/core";
import SearchedArticleCard from "./searched-article-card";
import useSearch from "./use-search/use-search";
import {MOBILE} from "../../theme/theme";
import MessageWithIcon from "../utility-components/message-with-icon";
import InfoIcon from "@material-ui/icons/Info";
import ScrollToTopButton from "./scroll-to-top-button";
import clsx from 'clsx';
import PaperWrapper from "./paper-wrapper";
import KeywordFrequency from "./keyword-frequency";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: theme.spacing(4, 0),
    [MOBILE(theme)]: {
      margin: theme.spacing(2, 0),
    }
  },
  centeringWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4, 2),
    [MOBILE(theme)]: {
      padding: theme.spacing(1),
    }
  },
  loadMoreButton: {
    maxWidth: '100%',
    width: 400,
    height: 40,
    margin: theme.spacing(1, 0)
  },
  totalCountRow: {
    width: '100%',
    margin: theme.spacing(1, 0),
    '& span': {
      display: 'block',
      width: 'fit-content',
      marginLeft: 'auto',
      fontWeight: 700,
      [MOBILE(theme)]: {
        marginLeft: 0,
        width: '100%',
        textAlign: 'center'
      }
    },
  },
  endOfResult: {
    '& span': {
      borderBottom: '1px solid rgba(0,0,0,0.32)',
      color: 'rgba(0,0,0,0.32)',
      fontWeight: 700,
      width: '100%',
      textAlign: 'center'
    }
  }
}));

interface SearchedArticlesProps {
}

const SearchedArticles = () => {
  const classes = useStyles();
  const search = useSearch();

  return (
    <div className={classes.root}>
      {
        search.requestState.data &&
        <>
          <div className={classes.totalCountRow}>
            <Typography variant={'body2'} component={'span'}>
              {`Found ${search.requestState.data.total} news articles, showing ${Math.min(1, search.requestState.data.docs.length)} - ${search.requestState.data.docs.length}`}
            </Typography>
          </div>
          {
            !!search.requestState.data.docs.length &&
            <PaperWrapper>
              <KeywordFrequency
                bin={search.requestState.data.histogram.map(obj => obj.key)}
                frequency={search.requestState.data.histogram.map(obj => obj.doc_count)}
                setDate={() => false}
              />
            </PaperWrapper>
          }
          {
            search.requestState.data.docs.map(doc => (
              <SearchedArticleCard data={doc} key={doc.id}/>
            ))
          }
        </>
      }
      {
        !search.requestState.isLoading && search.requestState.isError &&
        <MessageWithIcon icon={<InfoIcon/>} title={'Ooops'} text={search.requestState.errorMessage}/>
      }
      {
        !search.requestState.isLoading && !search.requestState.isError && search.requestState.data && !search.requestState.data.docs.length &&
        <MessageWithIcon icon={<InfoIcon/>} title={'No news article found'}
                         text={'Please try again with different keyword and filters'}/>
      }

      {
        search.requestState.isLoading &&
        <div className={classes.centeringWrapper}>
          <CircularProgress size={25}/>
        </div>
      }
      {
        !search.requestState.isLoading && !search.requestState.isError && search.requestState.data?.hasNext &&
        <Button className={classes.loadMoreButton} variant={'contained'} disableElevation color={'secondary'}
                onClick={search.doSearch}>
          Load more
        </Button>
      }
      {
        !search.requestState.isLoading && !search.requestState.isError && !search.requestState.data?.hasNext && !!search.requestState.data?.docs.length &&
        <div className={clsx(classes.centeringWrapper, classes.endOfResult)}>
          <Typography variant={'body2'} component={'span'}>
            END OF RESULT
          </Typography>
        </div>
      }

      <ScrollToTopButton/>
    </div>
  )
};

export default SearchedArticles
