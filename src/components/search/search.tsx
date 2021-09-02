import React from "react";
import {makeStyles} from "@material-ui/core";
import SearchInput from "./search-input";
import {MOBILE} from "../../theme";

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	widthWrapper: {
		maxWidth: theme.breakpoints.values['md'],
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

  return (
    <div className={classes.root}>
			<div className={classes.widthWrapper}>
				<SearchInput />
			</div>
    </div>
  )
};

export default Search
