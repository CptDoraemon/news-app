import React from "react";
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
        margin: theme.spacing(2, 0),
        [theme.breakpoints.down('md')]: {
            width: '100%'
        }
    },
    cardRoot: {
        width: '100%',
        margin: theme.spacing(2, 0),
    },
    cardActionArea: {
        '& a': {
            width: '100%',
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
        height: '100%',
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

    const {status, data, setStatus, setData, sortType, sortByRelevance, sortByDate} = useSearchNews(keyword);
    const classes = useStyles();

    const loadMoreNews = () => {
        requestSearchNews(keyword, data.length, setStatus, setData, data);
    };

    const newsCount = data.length;

    return (
        <div className={classes.root}>
            <div className={classes.widthWrapper}>
                { newsCount > 0 && <ResultsCountMessage count={newsCount} keyword={keyword}/> }
                { newsCount > 0 && <SortPanel sortType={sortType} sortByRelevance={sortByRelevance} sortByDate={sortByDate} /> }
                { status === Status.LOADED_EMPTY && `No news article related to "${keyword}" found`}
                { status === Status.ERROR && 'Server error please try later'}
                {
                    data.length > 0 &&
                        data.map((article: any, i: number) =>
                            <Card key={article._id} className={classes.cardRoot}>
                                <CardActionArea className={classes.cardActionArea}>
                                    <a href={article.url} target='_blank'>
                                        <CardMedia
                                            component="img"
                                            alt={article.title}
                                            className={classes.cardMedia}
                                            image={article.urlToImage}
                                            title={article.title}
                                        />
                                        <CardContent className={classes.cardContent}>
                                            <Typography variant="body1" component="h2">
                                                <Box fontWeight={700}>
                                                    <HighlightedContent content={article.title} keyword={keyword}/>
                                                </Box>
                                            </Typography>
                                            <Typography variant="body2" component="div" color="textSecondary">
                                                <Box fontWeight={700}>
                                                    {
                                                        new Date(article.publishedAt).toDateString()
                                                    }
                                                </Box>
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                <HighlightedContent content={article.content.replace(/\[\+[0-9]+\schars\]/ig, '')} keyword={keyword}/>
                                            </Typography>
                                        </CardContent>
                                    </a>
                                </CardActionArea>
                            </Card>
                        )
                }
                { status === Status.LOADING && <LoadingMessage/> }
                { status === Status.LOADED_NORMAL && <LoadMoreMessage onClick={loadMoreNews}/> }
                { status === Status.LOADED_NO_MORE &&
                    <Typography variant="body1" component="div">
                        <Box fontWeight={700}>
                            No more news
                        </Box>
                    </Typography>
                }
            </div>
        </div>
    )
};

export default SearchedArticles