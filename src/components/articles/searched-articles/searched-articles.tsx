import React, {RefObject, useEffect, useRef, useState} from "react";
import {Box, makeStyles} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import useSearchNews from "./use-search-news";
import requestSearchNews from "./request-search-news";
import Status from "./status";
import ResultsCountMessage from "./message-components/result-count-message";
import LoadingMessage from "./message-components/loading-message";
import LoadMoreMessage from "./message-components/load-more-message";
import HighlightedContent from "./highlighted-content";
import SortPanel from "./sort/sort-panel";
import GenericMessage from "./message-components/generic-message";
import SearchedArticleCard from "./searched-article-card";
import ScrollToTopButton from "./scroll-to-top-button";
import KeywordFrequency from "./keyword-frequency";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    widthWrapper: {
        width: '1000px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
            width: '100%'
        }
    },
    cardRoot: {
        width: '100%',
        margin: theme.spacing(2, 0),
    },
    cardActionArea: {
        width: '100%',
        height: '100%',
        '& a': {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            '&:visited, &:link': {
                textDecoration: 'inherit',
                color: 'inherit',
                cursor: 'pointer'
            }
        }
    },
    cardMedia: {
        width: '20%',
        height: '100%'
    },
    cardContent: {
        width: '80%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }
}));

interface SearchedArticlesProps {
    keyword: string
}

const SearchedArticles: React.FC<SearchedArticlesProps> = ({keyword}) => {

    const {status, data, setStatus, setData, sortType, sortByRelevance, sortByDate, setTotalCount, totalCount, frequencyData} = useSearchNews(keyword);
    const classes = useStyles();

    const loadMoreNews = () => {
        requestSearchNews(keyword, data.length, setStatus, setData, data, setTotalCount);
    };

    const resultsFound = data.length > 0;
    const hasMoreData = data.length < totalCount;
    const endOfResult = data.length === totalCount;

    return (
        <div className={classes.root}>
            <div className={classes.widthWrapper}>
                { resultsFound && <ResultsCountMessage count={totalCount} keyword={keyword} currentLength={data.length}/> }
                { frequencyData && resultsFound && <KeywordFrequency bin={frequencyData.bin} frequency={frequencyData.frequency}/>}
                { resultsFound && <SortPanel sortType={sortType} sortByRelevance={sortByRelevance} sortByDate={sortByDate} /> }
                { status === Status.LOADED_EMPTY && <GenericMessage message={`No news article related to "${keyword}" was found`}/>}
                { status === Status.ERROR && <GenericMessage message={'Server error please try later'}/>}
                {
                    resultsFound &&
                        data.map((article: any) =>
                            <SearchedArticleCard article={article} keyword={keyword} key={article._id}/>
                        )
                }
                { status === Status.LOADING && <LoadingMessage/> }
                { status === Status.LOADED_NORMAL && hasMoreData && totalCount > 0 && <LoadMoreMessage onClick={loadMoreNews}/> }
                { endOfResult && totalCount > 0 && <GenericMessage message={'End of results'} divider/>}
            </div>

            <ScrollToTopButton />
        </div>
    )
};

export default SearchedArticles