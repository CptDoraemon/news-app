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

const useStyles = makeStyles((theme) => createStyles({
    wrapper: {
        width: 'calc(100vw - 40px)',
        margin: '20px',
    },
    cardMediaPrimary: {
        height: '50vh',
    },
    cardMediaNormal: {
        height: '150px'
    },
    [theme.breakpoints.down("md")]: {
        wrapper: {
            width: '100vw',
            margin: '0'
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
            <Card raised>
                {
                    isVisible ?
                        <CardMedia
                            component="img"
                            alt={props.title}
                            className={isPrimaryCard ? classes.cardMediaPrimary : classes.cardMediaNormal}
                            image={props.urlToImage}
                            title={props.title}
                        /> :
                        <Skeleton variant={"rect"} height={'300px'} width={'100%'} />
                }

                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        { props.title }
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <Box component={'span'} fontWeight={700}>
                            Source: {' '}
                        </Box>
                        { props.source ? props.source : 'unknown'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <Box component={'span'} fontWeight={700}>
                            Author: {' '}
                        </Box>
                        { props.author ? props.author : 'unknown'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <Box component={'span'} fontWeight={700}>
                            { new Date(props.publishedAt).toLocaleString('en-CA', {
                                timeZone: 'America/Toronto',
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit',
                                })
                            }
                            { ' ' }
                            { new Date(props.publishedAt).toLocaleString('en-CA', {
                                timeZone: 'America/Toronto',
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                            })
                            }
                        </Box>
                    </Typography>
                    <Box mt={1}>
                    <Typography variant="body2" color="textSecondary" component="p">
                        { props.content }
                    </Typography>
                    </Box>
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