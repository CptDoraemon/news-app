import React from "react";
import {Button, CircularProgress, makeStyles, Typography} from "@material-ui/core";
import SearchedArticleCard from "./searched-article-card";
import useSearch from "./use-search/use-search";
import {MOBILE} from "../../theme";
import MessageWithIcon from "../utility-components/message-with-icon";
import InfoIcon from "@material-ui/icons/Info";
import ScrollToTopButton from "./scroll-to-top-button";
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	centeringWrapper: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: theme.spacing(4, 2),
		[MOBILE(theme)]: {
			padding: theme.spacing(1),
		}
	},
	loadMoreButton: {
		maxWidth: '100%',
		width: 400,
		height: 40,
		margin: theme.spacing(1, 0)
	},
	totalCountRow: {
		width: '100%',
		margin: theme.spacing(1, 0),
		'& span': {
			display: 'block',
			width: 'fit-content',
			marginLeft: 'auto',
			fontWeight: 700
		}
	},
	endOfResult: {
		'& span': {
			borderBottom: '1px solid rgba(0,0,0,0.32)',
			color: 'rgba(0,0,0,0.32)',
			fontWeight: 700,
			width: '100%',
			textAlign: 'center'
		}
	}
}));

interface SearchedArticlesProps {
	search: ReturnType<typeof useSearch>
}

const SearchedArticles = ({search}: SearchedArticlesProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
			{
				search.requestState.data &&
				<>
					<div className={classes.totalCountRow}>
						<Typography variant={'body2'} component={'span'}>
							{ `Found ${search.requestState.data.total} news articles, showing ${Math.min(1, search.requestState.data.docs.length)} - ${search.requestState.data.docs.length}` }
						</Typography>
					</div>
					{
						search.requestState.data.docs.map(doc => (
							<SearchedArticleCard data={doc} key={doc.id} keyword={search.keyword} />
						))
					}
				</>
			}
			{
				!search.requestState.isLoading && search.requestState.isError &&
				<MessageWithIcon icon={<InfoIcon/>} title={'Ooops'} text={search.requestState.errorMessage} />
			}
			{
				!search.requestState.isLoading && !search.requestState.isError && search.requestState.data && !search.requestState.data.docs.length && search.searchingParams !== null &&
				<MessageWithIcon icon={<InfoIcon/>} title={'Ooops'} text={'No news article found'} />
			}

			{
				search.requestState.isLoading &&
				<div className={classes.centeringWrapper}>
					<CircularProgress size={25} />
				</div>
			}
			{
				!search.requestState.isLoading && !search.requestState.isError && search.requestState.data?.hasNext &&
				<Button className={classes.loadMoreButton} variant={'contained'} disableElevation color={'secondary'} onClick={search.doSearch}>
					Load more
				</Button>
			}
			{
				!search.requestState.isLoading && !search.requestState.isError && !search.requestState.data?.hasNext && !!search.requestState.data?.docs.length &&
				<div className={clsx(classes.centeringWrapper, classes.endOfResult)}>
					<Typography variant={'body2'} component={'span'}>
						END OF RESULT
					</Typography>
				</div>
			}

			<ScrollToTopButton />
    </div>
  )
};

export default SearchedArticles
