import React, {useEffect, useRef, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia, Container, createStyles,
    Grid, Link,
    makeStyles,
    Typography, useMediaQuery, useTheme,
} from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
import {InitState} from "../../redux/reducers";
import {ArticleType} from "../../redux/actions";

function getPublishTime(date: Date): string{
    const timePast = Date.now() - date.getTime();
    if (timePast < 0) {
        return 'now'
    }
    const minutes = Math.floor(timePast / (60 * 1000));
    if (minutes <= 59) {
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    }
    const hours = Math.floor(timePast / (60 * 60 * 1000));
    if (hours <= 23) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    }
    const days = Math.floor(timePast / (24 * 60 * 60 * 1000));
    if (days <= 30) {
        return `${days} ${days === 1 ? 'day' : 'days'} ago`
    }
    const months = Math.floor(timePast / (30 * 24 * 60 * 60 * 1000));
    if (months <= 12) {
        return `${months} ${months === 1 ? 'month' : 'months'} ago`
    }
    const years = Math.floor(timePast / (365 * 24 * 60 * 60 * 1000));
    return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

const useStyles = makeStyles((theme) => createStyles({
    wrapper: {
        width: 'calc(100% - 40px)',
        margin: '20px',
    },
    cardWrapperPrimary: {
        height: '800px'
    },
    cardMediaPrimary: {
        height: '550px',
    },
    cardContentPrimary: {
        width: '100%',
        height: '200px'
    },
    cardWrapperNormal: {
        height: '400px'
    },
    cardMediaNormal: {
        height: '150px'
    },
    cardContentNormal: {
        height: '200px',
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
    },
    [theme.breakpoints.down("md")]: {
        wrapper: {
            width: 'calc(100% - 16px)',
            margin: '8px'
        }
    },
}));

function useLazyLoad(ref: any) {
    const [isVisible, setIsVisible] = useState(false);
    let scrollHandlerLastCalledAt = Date.now() - 1000;

    function checkIsVisible() {
        if (!ref.current) return;
        const calledAt = Date.now();
        if (calledAt - scrollHandlerLastCalledAt < 20) {
            return
        } else {
            scrollHandlerLastCalledAt = calledAt
        }

        const rect = ref.current.getBoundingClientRect();
        const isBefore = rect.top + rect.height < 0;
        const isAfter = rect.top > window.innerHeight;
        if (!isBefore && !isAfter) setIsVisible(true);
    }

    useEffect(() => {
        if (isVisible) return;
        checkIsVisible();
        document.addEventListener('scroll', checkIsVisible);
        return () => {
            document.removeEventListener('scroll', checkIsVisible);
        }
    }, [isVisible]);

    return isVisible;
}

interface ArticleProps extends ArticleType {
    id: number
}

function Article(props: ArticleProps) {
    const ref = useRef(null);
    const isVisible = useLazyLoad(ref);

    const classes = useStyles();
    const isPrimaryCard = props.id === 0 || props.id === 1;
    return (
        <Grid item xs={12} md={isPrimaryCard ? 6 : 3} ref={ref}>
            <Card raised className={isPrimaryCard ? classes.cardWrapperPrimary : classes.cardWrapperNormal}>
                {
                    isVisible && props.urlToImage?
                        <CardMedia
                            component="img"
                            alt={props.title}
                            className={isPrimaryCard ? classes.cardMediaPrimary : classes.cardMediaNormal}
                            image={props.urlToImage}
                            title={props.title}
                        /> :
                        <Skeleton variant={"rect"} height={'550px'} width={'100%'} />
                }

                <CardContent className={isPrimaryCard ? classes.cardContentPrimary : classes.cardContentNormal}>
                    <Typography gutterBottom variant="h5" component="h2">
                        { props.title }
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <Box component={'span'} fontWeight={700}>
                            { props.source ? props.source + ' - ' : props.author ? props.author + ' - ' : '' }
                            { getPublishTime(new Date(props.publishedAt)) }
                        </Box>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        { props.content }
                    </Typography>
                </CardContent>
                <CardActions>
                <Link href={props.url} target={'_blank'} rel="noopener" underline={"none"}>
                    <Button size="small" color="primary">
                        Learn more
                    </Button>
                </Link>
                </CardActions>
            </Card>
        </Grid>
    )
}

interface LoadedArticlesProps {
    articles: Array<ArticleType>
}

function LoadedArticles(props: LoadedArticlesProps) {
    return (
        <>
            {
                props.articles.map((article, i) => {
                    return (
                        <Article {...article} key={i} id={i}/>
                    )
                })
            }
        </>
    )
}

interface ArticlesProps extends Pick<InitState, 'articles'> {

}

function Articles(props: ArticlesProps) {
    const classes = useStyles();
    let content;
    if (props.articles.isError) {
        content = (
            <div>
                error
            </div>
        )
    } else if (props.articles.isFetching) {
        content = (
            <>
                {
                    Array.from(Array(10), (_, i) => {
                        return (
                            <Grid item key={i}>
                                <Box width={500} height={300} maxWidth={'100%'}>
                                    <Skeleton variant={"rect"} width={500} height={200}/>
                                    <Skeleton width={500}/>
                                    <Skeleton width={500}/>
                                </Box>
                            </Grid>
                        )
                    })
                }
            </>
        )
    } else {
        content = <LoadedArticles articles={props.articles.articles}/>
    }

    return (
        <Box className={classes.wrapper}>
            <Grid container direction={"row"} alignContent={"center"} justify={"center"} spacing={2}>
                { content }
            </Grid>
        </Box>
    )
}

export default Articles;