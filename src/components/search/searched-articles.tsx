import React from "react";
import {Button, CircularProgress, makeStyles} from "@material-ui/core";
import SearchedArticleCard from "./searched-article-card";
import useSearch from "./useSearch";
import {MOBILE} from "../../theme";
import MessageWithIcon from "../utility-components/message-with-icon";
import InfoIcon from "@material-ui/icons/Info";

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
		width: 200,
		margin: theme.spacing(1, 0)
	}
}));

interface SearchedArticlesProps {
	search: ReturnType<typeof useSearch>
}

const SearchedArticles = ({search}: SearchedArticlesProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SearchedArticleCard data={{
				author: "TASS",
				content: "MOSCOW, September 2. /TASS/. Russia’s new orbital station will operate autonomously to a large extent and will be kitted with artificial intelligence, Head of the State Space Corporation Roscosmos Dm… [+814 chars]",
				description: "The new orbital outpost in conjunction with the Zeus nuclear-powered space tug can serve as a prototype for future systems of lengthy inter-planetary flights, Dmitry Rogozin noted",
				publishedAt: "2021-09-02T15:56:30Z",
				source: "TASS",
				title: "Russia’s future orbital station to use artificial intelligence — Roscosmos chief - TASS",
				url: "https://tass.com/science/1333311",
				urlToImage: "https://tass.com/img/blocks/common/tass_logo_share_ru.png",
				category: 'asd'
			}} keyword={'asdasd'} />

			{
				search.requestState.isLoading &&
				<div className={classes.centeringWrapper}>
					<CircularProgress size={25} />
				</div>
			}
			{
				!search.requestState.isLoading && search.requestState.isError &&
				<MessageWithIcon icon={<InfoIcon/>} title={'Ooops'} text={search.requestState.errorMessage} />
			}
			{
				!search.requestState.isLoading && !search.requestState.isError && !search.requestState.data &&
				<MessageWithIcon icon={<InfoIcon/>} title={'Ooops'} text={'No news article found'} />
			}
			<Button className={classes.loadMoreButton} variant={'contained'} disableElevation color={'secondary'}>
				Load more
			</Button>
    </div>
  )
};

export default SearchedArticles
