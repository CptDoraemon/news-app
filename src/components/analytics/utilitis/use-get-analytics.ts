import useRequestState from "../../../tools/use-request-state";
import {useMount} from "react-use";
import axios from "axios";

interface AnalyticsData {
  summary: {
    totalCount: number,
    firstDocDate: string,
    lastDocDate: string
  },
  countByCategory: Array<{
    count: number,
    category: string
  }>,
}

const useGetAnalytics = () => {
  const request = useRequestState<AnalyticsData>();

  useMount(async () => {
    try {
      request.setIsLoading(true);
      const res = await axios.get('http://192.168.0.156:5000/api/news-analytics');
      const data = res.data;
      if (data.status !== 'ok') {
        throw new Error()
      }
      request.setData({
        summary: data.data.summary,
        countByCategory: data.data.countByCategory
      })

    } catch (e) {
      request.setGenericErrorMessage();
    } finally {
      request.setIsLoading(false);
    }
  });

  return request
}

export default useGetAnalytics
