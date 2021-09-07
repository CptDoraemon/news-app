import React from "react";
import {makeStyles} from "@material-ui/core";
import useGetArticleById from "./use-get-article-by-id";

const useStyles = makeStyles((theme) => ({

}));

interface ArticleByIdProps {
  id: string
}

const ArticleById = ({id}: ArticleByIdProps) => {
  const classes = useStyles();
  const article = useGetArticleById(id);

  return (
    <div>

    </div>
  )
};

export default ArticleById
