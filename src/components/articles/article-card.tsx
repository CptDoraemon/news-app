import React, {CSSProperties, useMemo, useRef} from "react";
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
import {ArticleData} from "./use-load-articles";

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

interface ArticleProps {
  index: number,
  openCopyLinkSnackBar: () => void,
  data: ArticleData
}

function ArticleCard({index, openCopyLinkSnackBar, data}: ArticleProps) {
  const ref = useRef(null);
  const isVisible = useLazyLoad(ref);
  const isTransitionAnimationNeeded = !useMediaQuery(useTheme().breakpoints.down('sm'));

  const isPrimaryCard = index === 0 || index === 1;
  //@ts-ignore
  const cardPrimaryClasses = usePrimaryCardStyles();
  //@ts-ignore
  const cardSecondaryClasses = useSecondaryCardStyles();
  const cardClasses = isPrimaryCard ? cardPrimaryClasses : cardSecondaryClasses;

  const content = useMemo(
    () => {
      let image;
      if (data.urlToImage) {
        if (isVisible) {
          image = <CardMedia
            component="img"
            alt={data.title}
            className={cardClasses.media}
            image={data.urlToImage}
            title={data.title}
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
        <Card raised ref={ref}>
          { image }

          <CardContent>
            <Typography gutterBottom variant="body1" component="h2" className={cardClasses.title}>
              <Box fontWeight={700}>
                { data.title }
              </Box>
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" className={cardClasses.source}>
              <Box component={'span'} fontWeight={700}>
                { data.source ? data.source + ' - ' : data.author ? data.author + ' - ' : '' }
                { getPublishTime(new Date(data.publishedAt)) }
              </Box>
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" className={cardClasses.articleContent}>
              { data.content && data.content.replace(/\[\+[0-9]+\schars\]/ig, '') }
            </Typography>
          </CardContent>
          <Buttons url={data.url} className={cardClasses.buttons} openCopyLinkSnackBar={openCopyLinkSnackBar} />
        </Card>
      )}, [data.urlToImage, data.title, data.source, data.author, data.publishedAt, data.content, data.url, isPrimaryCard, cardClasses.title, cardClasses.source, cardClasses.articleContent, cardClasses.buttons, cardClasses.media, cardClasses.skeleton, cardClasses.imageContain, openCopyLinkSnackBar, isVisible]
  );

  return isTransitionAnimationNeeded ? (
    <Zoom in={isVisible}>
      { content }
    </Zoom>
  ) : content;
}

export default ArticleCard
