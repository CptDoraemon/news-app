import React from "react";
import {makeStyles} from "@material-ui/core";
import useGetArticleById from "./use-get-article-by-id";
import Articles from "../articles/articles";

const useStyles = makeStyles((theme) => ({

}));

interface ArticleByIdProps {
  id: string
}

const ArticleById = ({id}: ArticleByIdProps) => {
  const classes = useStyles();
  const article = useGetArticleById(id);

  return (
    <Articles requestState={article} />
  )
};

export default ArticleById
