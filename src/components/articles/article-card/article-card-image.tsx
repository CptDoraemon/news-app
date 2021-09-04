import React from "react";
import {CardMedia, makeStyles} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: '100%',
		minHeight: '100%',
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		overflow: 'hidden'
	}
}));

interface ArticleCardImageProps {
	url: string,
	title: string,
	isVisible: boolean
}

const ArticleCardImage = ({url, title, isVisible}: ArticleCardImageProps) => {
  const classes = useStyles();
  const _url = url || process.env.PUBLIC_URL + '/xiaoxihome-news.jpg';

	if (_url && isVisible) {
		return <CardMedia
			component="img"
			alt={title}
			className={classes.root}
			image={_url}
			title={title}
		/>
	} else {
		return <Skeleton variant={"rect"} className={classes.root} />
	}
};

export default ArticleCardImage
