import React, {useEffect, useRef, useState} from "react";
import {Box, makeStyles} from "@material-ui/core";
import useSearchNews from "./requests/use-search-news";
import requestSearchNews from "./requests/request-search-news";
import Status from "./utilities/status";
import ResultsCountMessage from "./message-components/result-count-message";
import LoadingMessage from "./message-components/loading-message";
import LoadMoreMessage from "./message-components/load-more-message";
import SortPanel from "./filters/sort-panel";
import GenericMessage from "./message-components/generic-message";
import SearchedArticleCard from "./searched-article-card";
import ScrollToTopButton from "./utilities/scroll-to-top-button";
import KeywordFrequency from "./frequency-chart/keyword-frequency";
import Filters from "./filters/filters";
import getDateString from "./utilities/get-date-string";

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

    const {
        data,
        frequencyData,
        status,
        sortType,
        totalCount,
        pendingDateFilter,
        dateFilter,
        setPendingDateFilter,
        setDateFilter,
        loadMore,
        toggleSort
    } = useSearchNews(keyword);
    const classes = useStyles();

    const hasData = data.length > 0;

    const notFoundMessage =`No news article related to "${keyword}" was found ${dateFilter ? 'on ' + getDateString(dateFilter) : ''}`;
    const endOfResultMessage = 'End of results';
    const errorMessage = 'Server error please try later';

    return (
        <div className={classes.root}>
            <div className={classes.widthWrapper}>
                { hasData && <ResultsCountMessage count={totalCount} keyword={keyword} currentLength={data.length} dateFilter={dateFilter}/> }
                { hasData && frequencyData && <KeywordFrequency bin={frequencyData.bin} frequency={frequencyData.frequency} setDate={setPendingDateFilter}/>}
                { hasData && <Filters sortType={sortType} toggleSort={toggleSort} pendingDateFilter={pendingDateFilter} dateFilter={dateFilter} setDateFilter={setDateFilter}/> }
                { status === Status.LOADED_EMPTY && <GenericMessage message={notFoundMessage}/>}
                { status === Status.ERROR && <GenericMessage message={errorMessage}/>}
                {
                    hasData &&
                        data.map((article: any) =>
                            <SearchedArticleCard article={article} keyword={keyword} key={article._id}/>
                        )
                }
                { status === Status.LOADING && <LoadingMessage/> }
                { status === Status.LOADED_NORMAL && <LoadMoreMessage onClick={loadMore}/> }
                { status === Status.LOADED_NO_MORE && <GenericMessage message={endOfResultMessage} divider/>}
            </div>

            <ScrollToTopButton />
        </div>
    )
};

export default SearchedArticles