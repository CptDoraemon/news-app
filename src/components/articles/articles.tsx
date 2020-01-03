import React, {useRef, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia, createStyles,
    Grid, IconButton, Link,
    makeStyles, Snackbar, SnackbarContent,
    Typography, useMediaQuery, useTheme, Zoom,
} from "@material-ui/core";
import Close from '@material-ui/icons/Close';
import { green } from '@material-ui/core/colors';
import Skeleton from '@material-ui/lab/Skeleton';
import {InitState} from "../../redux/reducers";
import {ArticleType} from "../../redux/actions";
import useLazyLoad from "../../tools/use-lazy-load";
import getPublishTime from "../../tools/get-publish-time";
import copyToClipboard from "../../tools/copy-to-clipboard";

const useStyles = makeStyles((theme) => createStyles({
    successSnackBar: {
        backgroundColor: green[600]
    },
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
    skeletonPrimary: {
        height: '550px',
    },
    cardContentPrimary: {
        width: '100%',
        height: '200px',
        overflow: 'hidden',
        position: 'relative'
    },
    cardWrapperNormal: {
        height: '400px'
    },
    cardMediaNormal: {
        height: '150px'
    },
    skeletonNormal: {
        height: '150px',
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
        },
        cardWrapperPrimary: {
            height: '400px'
        },
        cardMediaPrimary: {
            height: '150px',
        },
        skeletonPrimary: {
            height: '150px',
        },
        cardContentPrimary: {
            height: '200px'
        },
        cardWrapperNormal: {
            height: '400px'
        },
        cardMediaNormal: {
            height: '150px',
        },
        skeletonNormal: {
            height: '150px',
        },
        cardContentNormal: {
            height: '200px'
        },
    },
}));

interface ButtonsProps {
    url: string
}


function Buttons(props: ButtonsProps) {
    const classes = useStyles();
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    function openSnackBar() {
        copyToClipboard(props.url);
        setIsSnackbarOpen(true);
    }
    function closeSnackBar() {
        setIsSnackbarOpen(false);
    }

    return (
        <CardActions>
            <Link href={props.url} target={'_blank'} rel="noopener" underline={"none"}>
                <Button size="small" color="primary">
                    Learn more
                </Button>
            </Link>
            <Button size="small" color="primary" onClick={openSnackBar}>Share</Button>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={isSnackbarOpen}
                autoHideDuration={3000}
                onClose={closeSnackBar}
            >
                    <SnackbarContent
                        className={classes.successSnackBar}
                        message={
                        <span id="client-snackbar">
                            Link copied to clipboard
                        </span>
                    }
                        action={[
                        <IconButton key="close" aria-label="close" color="inherit" onClick={closeSnackBar}>
                            <Close/>
                        </IconButton>,
                        ]}
                    />
            </Snackbar>
        </CardActions>
    )
}

interface ArticleProps extends ArticleType {
    id: number,
}

function Article(props: ArticleProps) {
    const ref = useRef(null);
    const isVisible = useLazyLoad(ref);

    const classes = useStyles();
    const isPrimaryCard = props.id === 0 || props.id === 1;
    const content = (
        <Grid
            item
            xs={12}
            md={isPrimaryCard ? 6 : 3}
            ref={ref}
        >
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
                        <Skeleton variant={"rect"} className={isPrimaryCard ? classes.skeletonPrimary : classes.skeletonNormal} />
                }

                <CardContent className={isPrimaryCard ? classes.cardContentPrimary : classes.cardContentNormal}>
                    <Typography gutterBottom variant="body1" component="h2">
                        <Box fontWeight={700}>
                            { props.title }
                        </Box>
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary" component="p">
                        <Box component={'span'} fontWeight={700}>
                            { props.source ? props.source + ' - ' : props.author ? props.author + ' - ' : '' }
                            { getPublishTime(new Date(props.publishedAt)) }
                        </Box>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        { props.content && props.content.replace(/\[\+[0-9]+\schars\]/ig, '') }
                    </Typography>
                </CardContent>
                <Buttons url={props.url}/>
            </Card>
        </Grid>
    );

    return useMediaQuery(useTheme().breakpoints.down('md')) ? content : (
        <Zoom in={isVisible}>
            { content }
        </Zoom>
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