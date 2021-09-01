import React, {useRef} from "react";
import {makeStyles, Paper} from "@material-ui/core";
import {ArticleData} from "../use-load-articles";
import clsx from 'clsx';
import ArticleCardImage from "./article-card-image";
import useLazyLoad from "../../../tools/use-lazy-load";
import ArticleCardContent from "./article-card-content";
import ArticleCardActions from "./article-card-actions";
import {MOBILE} from "../../../theme";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
		height: '100%',
		[MOBILE(theme)]: {
			padding: theme.spacing(1),
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
		height: '100%'
	},
	image: {
		width: '100%',
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
		padding: theme.spacing(2)
	},
	action: {
		padding: theme.spacing(2)
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

  return (
    <div className={clsx(classes.root, variant === 'big' && classes.rootBig, variant === 'normal' && classes.rootNormal)} ref={rootRef}>
			<Paper className={classes.paper}>
				<div className={clsx(classes.image, variant === 'big' && classes.imageBig, variant === 'normal' && classes.imageNormal)}>
					<ArticleCardImage url={data.urlToImage} title={data.title} isVisible={isVisible} />
				</div>
				<div className={classes.content}>
					<ArticleCardContent data={data}/>
				</div>
				<div className={classes.action}>
					<ArticleCardActions />
				</div>
			</Paper>
    </div>
  )
};

export default ArticleCard
