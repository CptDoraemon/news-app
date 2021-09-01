import React, {useRef} from "react";
import {makeStyles, Paper} from "@material-ui/core";
import {ArticleData} from "../use-load-articles";
import clsx from 'clsx';
import ArticleCardImage from "./article-card-image";
import useLazyLoad from "../../../tools/use-lazy-load";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
	},
	rootBig: {
		flex: '0 0 50%'
	},
	rootNormal: {
		flex: '0 0 25%'
	},
	paper: {
		overflow: 'hidden'
	},
	image: {
		width: '100%',
		height: 300
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
				<div className={classes.image}>
					<ArticleCardImage url={data.urlToImage} title={data.title} isVisible={isVisible} />
				</div>
			</Paper>
    </div>
  )
};

export default ArticleCard
