import React from "react";
import {makeStyles} from "@material-ui/core";
import SearchInput from "./search-input";
import {MOBILE} from "../../theme";
import TrendingSearch from "./trending-search";
import SearchedArticles from "./searched-articles";
import useSearch from "./use-search/use-search";

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	widthWrapper: {
		maxWidth: theme.breakpoints.values['lg'],
		width: '100%',
		padding: theme.spacing(2),
		margin: theme.spacing(2, 0),
		[MOBILE(theme)]: {
			padding: theme.spacing(1),
			margin: theme.spacing(1, 0),
		}
	}
}));

interface SearchProps {}

const Search = () => {
  const classes = useStyles();
	const search = useSearch();

  return (
    <div className={classes.root}>
			<div className={classes.widthWrapper}>
				<SearchInput search={search}/>
				<TrendingSearch/>
				<SearchedArticles search={search}/>
			</div>
    </div>
  )
};

export default Search
