import useRequestState from "../../../tools/use-request-state";
import {useMount} from "react-use";
import axios from "axios";
import {getBaseAPI} from "../../../routers";

export interface AnalyticsData {
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
    year: string,
    data: Array<{
      count: number,
      word: string
    }>
  }>,
}

const useGetAnalytics = () => {
  const request = useRequestState<AnalyticsData>();

  useMount(async () => {
    try {
      request.setIsLoading(true);
      const res = await axios.get(`${getBaseAPI()}/api/news-analytics`);
      const data = res.data;
      if (data.status !== 'ok') {
        throw new Error()
      }

      // docsCountByDay
      const docsCountByDay: AnalyticsData['docsCountByDay'] = [];
      data.data.docCountByDay.docCountByDay.forEach((count: number, i: number) => {
        docsCountByDay.push({
          count,
          date: data.data.docCountByDay.date[i]
        })
      })

      // docCountByDayAndCategory
      const _docCountByDayAndCategory = data.data.docCountByDayAndCategory;
      const quantity: number[][] = [];
      const series: string[] = [];
      const order = _docCountByDayAndCategory.categories;
      _docCountByDayAndCategory.date.forEach((date: number, index: number) => {
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
      console.log(e);
      request.setGenericErrorMessage();
    } finally {
      request.setIsLoading(false);
    }
  });

  return request
}

export default useGetAnalytics
