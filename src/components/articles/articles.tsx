import React from "react";
import {Box, makeStyles} from "@material-ui/core";
import {useMount} from "react-use";
import useLoadArticles from "./use-load-articles";
import {Skeleton} from "@material-ui/lab";
import Swipeable from "../utility-components/swipeable";
import InfoIcon from '@material-ui/icons/Info';
import MessageWithIcon from "../utility-components/message-with-icon";
import ArticleCard from "./article-card/article-card";

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'center',
		flexWrap: 'wrap',
		padding: theme.spacing(2),
		[theme.breakpoints.down("sm")]: {
			padding: theme.spacing(1),
		}
	},
	cardWrapper: {
		margin: theme.spacing(2),
		width: 'fit-content'
	}
}));

interface ArticlesProps {
	category: string
}

const Articles = ({category}: ArticlesProps) => {
  const classes = useStyles();
  const requestState = useLoadArticles(category);

	useMount(() => window.scrollTo(0, 0));

	return (
		<Swipeable goNext={() => false} goPrevious={() => false}>
			<div className={classes.root}>
				{
					requestState.isLoading &&
					new Array(10).fill(1).map((_, i) => {
						return (
							<Box width={500} height={300} maxWidth={'100%'} className={classes.cardWrapper} key={i}>
								<Skeleton variant={"rect"} width={500} height={200}/>
								<Skeleton width={500}/>
								<Skeleton width={500}/>
							</Box>
						)
					})
				}
				{
					!requestState.isLoading && requestState.isError &&
					<MessageWithIcon icon={<InfoIcon/>} title={'Ooops'} text={'We met an error, please try again later'} />
				}
				{
					!requestState.isLoading && !requestState.isError && !requestState.data &&
					<MessageWithIcon icon={<InfoIcon/>} title={'Ooops'} text={'No news article found'} />
				}
				{
					!requestState.isLoading && !requestState.isError && !!requestState.data &&
					requestState.data.map((article, i) => (
						<ArticleCard key={i} variant={i === 0 || i === 1 ? 'big' : 'normal'} data={article} />
					))
				}
			</div>
		</Swipeable>
	)
};

export default Articles
