import React from "react";
import {makeStyles} from "@material-ui/core";
import SearchInput from "./search-input";
import {MOBILE} from "../../theme";
import TrendingSearch from "./trending-search";
import SearchedArticles from "./searched-articles";
import {useLocation} from "react-router-dom";

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

interface SearchProps {
}

const Search = () => {
  const classes = useStyles();
  const locationSearch = useLocation().search;

  return (
    <div className={classes.root}>
      <div className={classes.widthWrapper}>
        <SearchInput/>
        <TrendingSearch/>
        <SearchedArticles key={locationSearch}/>
      </div>
    </div>
  )
};

export default Search
