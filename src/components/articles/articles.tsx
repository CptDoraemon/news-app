import React, {CSSProperties, useEffect, useMemo, useRef} from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    createStyles,
    Grid,
    Link,
    makeStyles,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
    Zoom,
} from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
import useLazyLoad from "../../tools/use-lazy-load";
import getPublishTime from "../../tools/get-publish-time";
import copyToClipboard from "../../tools/copy-to-clipboard";
import {ThemeStyle} from "@material-ui/core/styles/createTypography";
import Swipeable from '../utility-components/swipeable';
import { Article as ArticleType} from "../../redux/actions/articles";
import {State} from "../../redux/state";

const useStyles = makeStyles((theme) => createStyles({
    wrapper: {
        width: '100%',
        padding: '20px 20px 150px 20px',
    },
    [theme.breakpoints.down("sm")]: {
        wrapper: {
            padding: '8px 8px 150px 8px'
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

const cardCommonStyles = (theme: Theme) => ({
    buttons: {
        ...overFlowHidden,
    },
    imageContain: {
        backgroundSize: 'contain',
        backgroundColor: theme.palette.primary.main
    }
});

const usePrimaryCardStyles = makeStyles((theme) => ({
    ...cardCommonStyles(theme),
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
    [theme.breakpoints.down("sm")]: {
        media: {
            height: '200px',
        },
        skeleton: {
            height: '200px',
        },
    }
}));



const useSecondaryCardStyles = makeStyles((theme) => ({
    ...cardCommonStyles(theme),
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
    imageContain: {
        backgroundSize: 'contain',
        backgroundColor: theme.palette.primary.main
    },
    [theme.breakpoints.down("sm")]: {

    }
}));

interface ButtonsProps {
    url: string,
    className: string,
    openCopyLinkSnackBar: () => void
}


function Buttons(props: ButtonsProps) {

    function copyLinkHandler() {
        copyToClipboard(props.url);
        props.openCopyLinkSnackBar();
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
    openCopyLinkSnackBar: () => void
}

function Article(props: ArticleProps) {
    const ref = useRef(null);
    const isVisible = useLazyLoad(ref);
    const isTransitionAnimationNeeded = !useMediaQuery(useTheme().breakpoints.down('sm'));

    const isPrimaryCard = props.id === 0 || props.id === 1;
    //@ts-ignore
    const cardPrimaryClasses = usePrimaryCardStyles();
    //@ts-ignore
    const cardSecondaryClasses = useSecondaryCardStyles();
    const cardClasses = isPrimaryCard ? cardPrimaryClasses : cardSecondaryClasses;

    const content = useMemo(
        () => {
            let image;
            if (props.urlToImage) {
                if (isVisible) {
                    image = <CardMedia
                        component="img"
                        alt={props.title}
                        className={cardClasses.media}
                        image={props.urlToImage}
                        title={props.title}
                    />
                } else {
                    image = <Skeleton variant={"rect"} className={cardClasses.skeleton} />
                }
            } else {
                image = <CardMedia
                    className={`${cardClasses.media} ${cardClasses.imageContain}`}
                    image={process.env.PUBLIC_URL + '/xiaoxihome-news.jpg'}
                    title={'No image'}
                />
            }

            return (
                <Grid
                    item
                    xs={12}
                    md={isPrimaryCard ? 6 : 3}
                    ref={ref}
                >
                    <Card raised>
                        { image }

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
                        <Buttons url={props.url} className={cardClasses.buttons} openCopyLinkSnackBar={props.openCopyLinkSnackBar} />
                    </Card>
                </Grid>
            )}, [props, isVisible]
    );

    return isTransitionAnimationNeeded ? (
        <Zoom in={isVisible}>
            { content }
        </Zoom>
    ) : content;
}

interface LoadedArticlesProps {
    articles: Array<ArticleType>,
    openCopyLinkSnackBar: () => void
}

function LoadedArticles(props: LoadedArticlesProps) {
    return (
        <>
            {
                props.articles.map((article, i) => {
                    return (
                        <Article {...article} key={i} id={i} openCopyLinkSnackBar={props.openCopyLinkSnackBar}/>
                    )
                })
            }
        </>
    )
}

interface ArticlesProps {}

function Articles() {
    const classes = useStyles();

    // scroll to top after is category changed
    useEffect(() => {
        window.scrollTo(0, 0);
    });

    let content;
    // if (props.articles.isError) {
    //     content = (
    //         <div style={{
    //             width: '100%'
    //         }}>
    //             error
    //         </div>
    //     )
    // } else if (props.articles.isFetching) {
    //     content = (
    //         <>
    //             {
    //                 Array.from(Array(10), (_, i) => {
    //                     return (
    //                         <Grid item key={i}>
    //                             <Box width={500} height={300} maxWidth={'100%'}>
    //                                 <Skeleton variant={"rect"} width={500} height={200}/>
    //                                 <Skeleton width={500}/>
    //                                 <Skeleton width={500}/>
    //                             </Box>
    //                         </Grid>
    //                     )
    //                 })
    //             }
    //         </>
    //     )
    // } else {
    //     content = <LoadedArticles articles={props.articles.articles} openCopyLinkSnackBar={props.openCopyLinkSnackBar}/>
    // }

    return (
        <Swipeable goNext={() => false} goPrevious={() => false}>
            <Box className={classes.wrapper}>
                <Grid container direction={"row"} alignContent={"center"} justify={"center"} spacing={2}>
                    { content }
                </Grid>
            </Box>
        </Swipeable>
    )
}

export {Article, Articles as default}
