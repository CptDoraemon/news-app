import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core";
import useSearchNews from "./requests/use-search-news";
import Status from "./utilities/status";
import ResultsCountMessage from "./message-components/result-count-message";
import LoadingMessage from "./message-components/loading-message";
import LoadMoreMessage from "./message-components/load-more-message";
import GenericMessage from "./message-components/generic-message";
import SearchedArticleCard from "./searched-article-card";
import ScrollToTopButton from "./utilities/scroll-to-top-button";
import KeywordFrequency from "./frequency-chart/keyword-frequency";
import Filters from "./filters/filters";
import getDateString from "./utilities/get-date-string";
import {ISearchedArticle, IFrequencyData} from "./requests/response-types";

const useShowChartAndFilters = (data: ISearchedArticle[], frequencyData: IFrequencyData | null, keyword: string) => {
    // reset when new keyword is searched
    // show chart and filter if initial search found some data
    // sequential searches on same keyword caused by applied filters
    // keep chart and filter visible after initial search is made

    const [foundDataOnKeyword, setFoundDataOnKeyword] = useState(false);

    useEffect(() => {
        if (data.length > 0 && frequencyData) {
            setFoundDataOnKeyword(true)
        }
    }, [data, frequencyData]);

    useEffect(() => {
        setFoundDataOnKeyword(false)
    }, [keyword]);

    return foundDataOnKeyword
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: theme.spacing(2, 0)
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

    const notFoundMessage =`No news article related to "${keyword}"${dateFilter ? ' on ' + getDateString(dateFilter) : ''} was found`;
    const endOfResultMessage = 'End of results';
    const errorMessage = 'Server error please try later';

    const showChartAndFilters = useShowChartAndFilters(data, frequencyData, keyword);

    return (
        <div className={classes.root} key={keyword}>
            <div className={classes.widthWrapper}>
                { showChartAndFilters && frequencyData && <KeywordFrequency bin={frequencyData.bin} frequency={frequencyData.frequency} setDate={setPendingDateFilter}/>}
                { showChartAndFilters && <Filters sortType={sortType} toggleSort={toggleSort} pendingDateFilter={pendingDateFilter} dateFilter={dateFilter} setDateFilter={setDateFilter}/> }
                { hasData && <ResultsCountMessage count={totalCount} keyword={keyword} currentLength={data.length} dateFilter={dateFilter}/> }
                { status === Status.LOADED_EMPTY && <GenericMessage message={notFoundMessage}/>}
                { status === Status.ERROR && <GenericMessage message={errorMessage}/>}
                {
                    hasData &&
                        data.map((article) =>
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