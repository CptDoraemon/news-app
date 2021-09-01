import React from "react";
import useGetCategoryFromQuery from "./use-get-category-from-query";
import {newsCategories} from "../header/news-categories";
import {Redirect} from "react-router-dom";
import Articles from "./articles";

interface ArticlesContainerProps {}

const ArticlesContainer = () => {
	const category = useGetCategoryFromQuery();

	if (!category || !(newsCategories as string[]).includes(category)) {
		return <Redirect to={`/?category=${newsCategories[0]}`} />
	} else return (
		<Articles category={category} key={category}/>
	)
};

export default ArticlesContainer
