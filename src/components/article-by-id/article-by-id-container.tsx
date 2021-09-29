import React from "react";
import {makeStyles} from "@material-ui/core";
import {useParams} from "react-router-dom";
import ArticleById from "./article-by-id";

const useStyles = makeStyles((theme) => ({

}));

interface ArticleByIdContainerProps {}

const ArticleByIdContainer = () => {
  const classes = useStyles();
  const {id} = useParams<{id: string}>();

  return (
    <ArticleById id={id} key={id} />
  )
};

export default ArticleByIdContainer
