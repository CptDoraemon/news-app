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
  docsCountByDay: Array<{
    count: number,
    date: number
  }>,
  docCountByDayAndCategory: {
    quantity: number[][],
    series: string[],
    order: string[]
  },
  wordCloud: Array<{
    count: number,
    word: string
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
      const _docCountByDayAndCategory = data.data.docCountByDayAndCategory;
      const docsCountByDay: AnalyticsData['docsCountByDay'] = [];
      const quantity: number[][] = [];
      const series: string[] = [];
      const order = _docCountByDayAndCategory.categories;

      _docCountByDayAndCategory.date.forEach((date: number, index: number) => {
        docsCountByDay.push({
          count: _docCountByDayAndCategory.docCountByDay[index],
          date,
        });
        series.push(new Date(date).toISOString());
        quantity.push(_docCountByDayAndCategory.docCountByDayAndCategory[index])
      })
      request.setData({
        summary: data.data.summary,
        countByCategory: data.data.countByCategory,
        docsCountByDay,
        docCountByDayAndCategory: {
          quantity,
          series,
          order
        },
        wordCloud: data.data.wordFrequency
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
