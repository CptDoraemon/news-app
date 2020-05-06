import React, {useEffect, useRef, useState} from "react";
import {Box, makeStyles} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import HighlightedContent from "./highlighted-content";
import {ISearchedArticle} from "./requests/response-types";

const useGetHeight = () => {
    const [cardHeight, setCardHeight] = useState(0);
    const heightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (heightRef.current) {
            const cardHeight = heightRef.current.getBoundingClientRect().height;
            setCardHeight(cardHeight)
        }
    }, [heightRef]);

    return {
        cardHeight,
        heightRef
    }
};

const useStyles = makeStyles((theme) => ({
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
    imageContain: {
        backgroundSize: 'contain',
        backgroundColor: theme.palette.primary.main
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

interface SearchedArticleCardProps {
    article: ISearchedArticle,
    keyword: string
}

const SearchedArticleCard: React.FC<SearchedArticleCardProps> = ({article, keyword}) => {
    const classes = useStyles();
    
    const {cardHeight, heightRef} = useGetHeight();
    
    return (
        <Card className={classes.cardRoot} style={{height: cardHeight ? `${cardHeight}px` : 'auto'}}>
            <CardActionArea className={classes.cardActionArea}>
                <a href={article.url} target='_blank' rel="noopener noreferrer">
                    {
                        article.urlToImage ?
                            <CardMedia
                                component="img"
                                alt={article.title}
                                className={classes.cardMedia}
                                image={article.urlToImage}
                                title={article.title}
                            /> :
                            <CardMedia
                                className={`${classes.cardMedia} ${classes.imageContain}`}
                                image={process.env.PUBLIC_URL + '/xiaoxihome-news.jpg'}
                                title={'No image'}
                            />
                    }
                    <CardContent className={classes.cardContent} ref={heightRef}>
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
};

export default SearchedArticleCard