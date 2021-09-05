import {useLocation} from "react-router-dom";
import useRequestState from "../../../tools/use-request-state";
import {useCallback, useEffect, useRef} from "react";
import axios from "axios";
import queryString from "query-string";
import {usePrevious} from "react-use";

export interface SearchedArticle {
  id: string,
  author: string
  category: string,
  content: string,
  description: string,
  publishedAt: string
  source: string
  title: string,
  url: string,
  urlToImage: string
}

interface SearchResponse {
  docs: SearchedArticle[],
  total: number,
  hasNext: boolean
}

const useSearch = () => {
  const location = useLocation();
  const previousLocationSearch = usePrevious(location.search);
  const requestState = useRequestState<SearchResponse>();
  const pageRef = useRef(1);

  const doSearch = useCallback(async () => {
    try {
      if (requestState.isLoading) {
        return
      }

      requestState.resetError();
      requestState.setIsLoading(true);
      const res = await axios.get('http://192.168.0.156:5000/api/search-news', {
        params: {
          ...queryString.parse(location.search),
          page: pageRef.current
        }
      });
      const data = res.data;
      if (data.status === 'ok') {
        requestState.setData(prev => {
          const newDocs = prev === null ? data.docs : [...prev.docs, ...data.docs];
          return {
            docs: newDocs,
            total: data.total,
            hasNext: data.hasNext,
          }
        });
      } else {
        requestState.setErrorMessage(res.data.message)
      }
      pageRef.current = pageRef.current + 1;
    } catch (e) {
      requestState.setGenericErrorMessage()
    } finally {
      requestState.setIsLoading(false)
    }
  }, [location.search, requestState]);

  useEffect(() => {
    if (location.search !== previousLocationSearch && location.search.length > 0) {
      pageRef.current = 1;
      requestState.setData(null)
      doSearch()
    }
  }, [doSearch, location.search, previousLocationSearch, requestState]);

  return {
    requestState,
    doSearch
  }
}

export default useSearch
