import useRequestState from "../../tools/use-request-state";
import {useCallback} from "react";
import axios from "axios";
import {useMount} from "react-use";

export interface ArticleData {
  source: string,
  author: string,
  title: string,
  description: string,
  url: string,
  urlToImage: string,
  publishedAt: string,
  content: string
}

const useLoadArticles = (category: string) => {
  const requestState = useRequestState<ArticleData[]>();

  const loadNewsInCategory = useCallback(async () => {
    try {
      requestState.resetAll();
      requestState.setIsLoading(true);
      const query = `
        {
            getNews(category: ${category.toUpperCase()}) {
                source,
                author,
                title,
                description,
                url,
                urlToImage,
                publishedAt,
                content
            }
        }
    `;
      const res = await axios.get(`https://www.xiaoxihome.com/api/news?query=${encodeURIComponent(query)}`);
      const data = res.data;
      requestState.setData(data.data.getNews);
    } catch (e) {
      requestState.setGenericErrorMessage();
    } finally {
      requestState.setIsLoading(false);
    }
  }, [category, requestState]);

  useMount(loadNewsInCategory);

  return requestState
}

export default useLoadArticles
