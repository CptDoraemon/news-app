import useRequestState from "../../../tools/use-request-state";
import {useMount} from "react-use";
import axios from "axios";

export interface TrendingItem {
  "key": string,
  "doc_count": number
}

interface TrendingSearchData {
  lastWeek: Array<TrendingItem>,
  allTime: Array<TrendingItem>
}

const useTrendingSearch = () => {
  const request = useRequestState<TrendingSearchData>();

  useMount(async () => {
    try {
      request.setIsLoading(true);
      const res = await axios.get('http://localhost:5000/api/search-news/trending');
      const data = res.data;
      if (data.status !== 'ok') {
        throw new Error()
      }
      request.setData({
        lastWeek: data.lastWeek.slice(),
        allTime: data.allTime.slice()
      })
    } catch (e) {
      request.setGenericErrorMessage()
    } finally {
      request.setIsLoading(false)
    }
  });

  return {request}
}

export default useTrendingSearch
