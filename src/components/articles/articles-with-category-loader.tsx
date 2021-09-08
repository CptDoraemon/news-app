import React from "react";
import {makeStyles} from "@material-ui/core";
import useLoadArticles from "./use-load-articles";
import Articles from "./articles";

const useStyles = makeStyles((theme) => ({

}));

interface ArticlesWithCategoryLoaderProps {
  category: string
}

const ArticlesWithCategoryLoader = ({category}: ArticlesWithCategoryLoaderProps) => {
  const classes = useStyles();
  const requestState = useLoadArticles(category);

  return <Articles requestState={requestState} />
};

export default ArticlesWithCategoryLoader
