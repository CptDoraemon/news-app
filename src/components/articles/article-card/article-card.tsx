import React, {useRef} from "react";
import {makeStyles, Paper, useMediaQuery, Zoom} from "@material-ui/core";
import {ArticleData} from "../use-load-articles";
import clsx from 'clsx';
import ArticleCardImage from "./article-card-image";
import useLazyLoad from "../../../tools/use-lazy-load";
import ArticleCardContent from "./article-card-content";
import ArticleCardActions from "./article-card-actions";
import {MOBILE} from "../../../theme";
import {useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
		[MOBILE(theme)]: {
			padding: theme.spacing(0.5),
		}
	},
	rootBig: {
		flex: '0 0 50%',
		[MOBILE(theme)]: {
			flex: '0 0 100%',
		}
	},
	rootNormal: {
		flex: '0 0 25%',
		[MOBILE(theme)]: {
			flex: '0 0 100%',
		}
	},
	paper: {
		overflow: 'hidden',
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	image: {
		width: '100%',
		flex: '0 0 auto'
	},
	imageNormal: {
		height: 300,
		[MOBILE(theme)]: {
			height: 200,
		}
	},
	imageBig: {
		height: 500,
		[MOBILE(theme)]: {
			height: 200,
		}
	},
	content: {
		padding: theme.spacing(2),
		flex: '1 1 auto',
		width: '100%',
	},
	action: {
		flex: '0 0 auto',
		padding: theme.spacing(2),
		width: '100%',
	}
}));

interface ArticleCardProps {
	data: ArticleData
	variant: 'big' | 'normal'
}

const ArticleCard = ({data, variant}: ArticleCardProps) => {
  const classes = useStyles();
  const rootRef = useRef<HTMLDivElement>(null);
	const isVisible = useLazyLoad(rootRef);
	const theme = useTheme();
	const isMobile = useMediaQuery(MOBILE(theme));

  return (
  	<Zoom in={isMobile || isVisible}>
			<div className={clsx(classes.root, variant === 'big' && classes.rootBig, variant === 'normal' && classes.rootNormal)} ref={rootRef}>
				<Paper className={classes.paper}>
					<div className={clsx(classes.image, variant === 'big' && classes.imageBig, variant === 'normal' && classes.imageNormal)}>
						<ArticleCardImage url={data.urlToImage} title={data.title} isVisible={isVisible} />
					</div>
					<div className={classes.content}>
						<ArticleCardContent data={data}/>
					</div>
					<div className={classes.action}>
						<ArticleCardActions data={data}/>
					</div>
				</Paper>
			</div>
		</Zoom>
  )
};

export default ArticleCard
