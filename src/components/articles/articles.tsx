import React, {CSSProperties, useEffect, useRef, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    createStyles,
    Grid,
    IconButton,
    Link,
    makeStyles,
    Snackbar,
    SnackbarContent,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
    Zoom,
} from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
import {InitState} from "../../redux/reducers";
import {ArticleType, openCopyLinkSnackBar, setNextCategory, setPreviousCategory} from "../../redux/actions";
import useLazyLoad from "../../tools/use-lazy-load";
import getPublishTime from "../../tools/get-publish-time";
import copyToClipboard from "../../tools/copy-to-clipboard";
import {ThemeStyle} from "@material-ui/core/styles/createTypography";
import useSwipeable, {UseSwipeableDirections} from "../../tools/use-swipeable";

const useStyles = makeStyles((theme) => createStyles({
    wrapper: {
        width: 'calc(100% - 40px)',
        margin: '20px',
    },
    [theme.breakpoints.down("sm")]: {
        wrapper: {
            width: 'calc(100% - 16px)',
            margin: '8px'
        },
    },
}));

function calcHeight(lines: number, variant: ThemeStyle, theme: Theme): CSSProperties['height'] {
    return `calc(${lines} * ${theme.typography[variant].fontSize} * ${theme.typography[variant].lineHeight})`;
}

function ellipsis(variant: ThemeStyle, theme: Theme) {
    return createStyles({
        root: {
            position: 'relative',
            '&:after': {
                content: "''",
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '20%',
                height: calcHeight(1, variant, theme),
                backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0) , rgba(255, 255, 255, 1))',
                zIndex: 10
            },
        }
    })
}

const overFlowHidden: CSSProperties = {
    width: '100%',
    overflow: 'hidden',
    position: 'relative'
};

const usePrimaryCardStyles = makeStyles((theme) => createStyles({
    media: {
        height: '550px',
        ...overFlowHidden,
    },
    skeleton: {
        height: '550px',
        ...overFlowHidden,
    },
    title: {
        height: calcHeight(1, 'body1', theme),
        ...ellipsis('body1', theme).root,
        ...overFlowHidden,
    },
    source: {
        height: calcHeight(1, 'body2', theme),
        ...overFlowHidden,
    },
    articleContent: {
        height: calcHeight(2, 'body2', theme),
        ...ellipsis('body2', theme).root,
        ...overFlowHidden,
    },
    buttons: {
        ...overFlowHidden,
    },
    [theme.breakpoints.down("sm")]: {
        media: {
            height: '200px',
        },
        skeleton: {
            height: '200px',
        },
    }
}));



const useSecondaryCardStyles = makeStyles((theme) => createStyles({
    media: {
        height: '200px',
        ...overFlowHidden,
    },
    skeleton: {
        height: '200px',
        ...overFlowHidden,
    },
    title: {
        height: calcHeight(2, 'body1', theme),
        ...ellipsis('body1', theme).root,
        ...overFlowHidden,
    },
    source: {
        height: calcHeight(1, 'body2', theme),
        ...overFlowHidden,
    },
    articleContent: {
        height: calcHeight(3, 'body2', theme),
        ...ellipsis('body2', theme).root,
        ...overFlowHidden,
    },
    buttons: {
        ...overFlowHidden,
    },
    [theme.breakpoints.down("sm")]: {

    }
}));

interface ButtonsProps {
    url: string,
    className: string,
    dispatcher: any
}


function Buttons(props: ButtonsProps) {

    function copyLinkHandler() {
        copyToClipboard(props.url);
        props.dispatcher(openCopyLinkSnackBar())
    }

    return (
        <CardActions className={props.className}>
            <Link href={props.url} target={'_blank'} rel="noopener" underline={"none"}>
                <Button size="small" color="primary">
                    Learn more
                </Button>
            </Link>
            <Button size="small" color="primary" onClick={copyLinkHandler}>Share</Button>
        </CardActions>
    )
}

interface ArticleProps extends ArticleType {
    id: number,
    dispatcher: any
}

function Article(props: ArticleProps) {
    const ref = useRef(null);
    const isVisible = useLazyLoad(ref);
    const [isMounted, setIsMounted] = useState(false);
    const isTransitionAnimationNeeded = !useMediaQuery(useTheme().breakpoints.down('sm'));

    const isPrimaryCard = props.id === 0 || props.id === 1;
    const cardPrimaryClasses = usePrimaryCardStyles();
    const cardSecondaryClasses = useSecondaryCardStyles();
    const cardClasses = isPrimaryCard ? cardPrimaryClasses : cardSecondaryClasses;

    useEffect(() => {
        if (isTransitionAnimationNeeded) {
            setTimeout(() =>setIsMounted(true), 225)
            // Zoom transition 225ms
        }
    }, []);

    const content = (
        <Grid
            item
            xs={12}
            md={isPrimaryCard ? 6 : 3}
            ref={ref}
        >
            <Card raised>
                {
                    isVisible && props.urlToImage?
                        <CardMedia
                            component="img"
                            alt={props.title}
                            className={cardClasses.media}
                            image={props.urlToImage}
                            title={props.title}
                        /> :
                        <Skeleton variant={"rect"} className={cardClasses.skeleton} />
                }

                <CardContent>
                    <Typography gutterBottom variant="body1" component="h2" className={cardClasses.title}>
                        <Box fontWeight={700}>
                            { props.title }
                        </Box>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" className={cardClasses.source}>
                        <Box component={'span'} fontWeight={700}>
                            { props.source ? props.source + ' - ' : props.author ? props.author + ' - ' : '' }
                            { getPublishTime(new Date(props.publishedAt)) }
                        </Box>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" className={cardClasses.articleContent}>
                        { props.content && props.content.replace(/\[\+[0-9]+\schars\]/ig, '') }
                    </Typography>
                </CardContent>
                <Buttons url={props.url} className={cardClasses.buttons} dispatcher={props.dispatcher}/>
            </Card>
        </Grid>
    );

    return isTransitionAnimationNeeded ? (
        <Zoom in={!isMounted ? true : isVisible}>
            { content }
        </Zoom>
    ) : content;
}

interface LoadedArticlesProps {
    articles: Array<ArticleType>,
    dispatcher: any
}

function LoadedArticles(props: LoadedArticlesProps) {
    return (
        <>
            {
                props.articles.map((article, i) => {
                    return (
                        <Article {...article} key={i} id={i} dispatcher={props.dispatcher}/>
                    )
                })
            }
        </>
    )
}

interface ArticlesProps extends Pick<InitState, 'articles'> {
    dispatcher: any,
}

function Articles(props: ArticlesProps) {
    const classes = useStyles();
    const containerRef = useRef(null);
    const {
        direction,
        dragDistance,
        resetSwipeStatus
    } = useSwipeable(containerRef, 50);

    useEffect(() => {
        if (direction === UseSwipeableDirections.RIGHT) {
            props.dispatcher(setPreviousCategory())
        } else if (direction === UseSwipeableDirections.LEFT) {
            props.dispatcher(setNextCategory())
        }
        return () => {
            resetSwipeStatus();
        }
    }, [direction]);

    let content;
    if (props.articles.isError) {
        content = (
            <div style={{
                width: '100%',
                minHeight: '100vh'
            }}>
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
        content = <LoadedArticles articles={props.articles.articles} dispatcher={props.dispatcher}/>
    }

    return (
        <div style={{
            width: '100%',
            transform: `translateX(${dragDistance}px)`,
            // it affects snackbar fixed behavior
            // left: `${dragDistance}px`,
            // position: 'relative'
        }}>
            <Box className={classes.wrapper}>
                <Grid container direction={"row"} alignContent={"center"} justify={"center"} spacing={2} ref={containerRef}>
                    { content }
                </Grid>
            </Box>
        </div>
    )
}

export default Articles;