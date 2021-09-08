import React, {useCallback, useMemo} from "react";
import useGetCategoryFromQuery from "./use-get-category-from-query";
import {newsCategories, NewsCategory} from "../../routers";
import {Redirect, useHistory} from "react-router-dom";
import Swipeable from "../utility-components/swipeable";
import ArticlesWithCategoryLoader from "./articles-with-category-loader";

interface ArticlesContainerProps {
}

const ArticlesContainer = () => {
  const category = useGetCategoryFromQuery();
  const history = useHistory();
  const willRedirect = useMemo(() => {
    return !category || !(newsCategories as string[]).includes(category)
  }, [category])

  const goNextCategory = useCallback(() => {
    if (willRedirect) return;
    const index = newsCategories.indexOf(category as NewsCategory);
    const nextIndex = index + 1 >= newsCategories.length ? 0 : index + 1;
    history.replace(`/?category=${newsCategories[nextIndex]}`)
  }, [category, history, willRedirect]);

  const goPreviousCategory = useCallback(() => {
    if (willRedirect) return;
    const index = newsCategories.indexOf(category as NewsCategory);
    const nextIndex = index - 1 < 0 ? newsCategories.length - 1 : index - 1;
    history.replace(`/?category=${newsCategories[nextIndex]}`)
  }, [category, history, willRedirect]);

  if (willRedirect) {
    return <Redirect to={`/?category=${newsCategories[0]}`}/>
  } else return (
    <Swipeable goNext={goNextCategory} goPrevious={goPreviousCategory}>
      <ArticlesWithCategoryLoader
        category={category as string}
        key={category}
      />
    </Swipeable>
  )
};

export default ArticlesContainer
